import datetime
import secrets
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    check_login_rate_limit
)

router = APIRouter()

@router.post("/register", response_model=schemas.TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(
    data: schemas.UserRegister,
    response: Response,
    db: Session = Depends(get_db)
):
    # Check if user already exists
    existing = db.query(models.User).filter(models.User.email == data.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Hash password with bcrypt
    hashed = hash_password(data.password)
    new_user = models.User(
        email=data.email.lower().strip(),
        hashed_password=hashed,
        full_name=data.full_name,
        phone=data.phone,
        role="customer",
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize user cart
    user_cart = models.Cart(user_id=new_user.id)
    db.add(user_cart)
    db.commit()

    # Generate JWT
    token = create_access_token({"sub": new_user.id, "email": new_user.email, "role": new_user.role})

    # Set secure HTTP-only cookie
    response.set_cookie(
        key="ikea_access_token",
        value=token,
        httponly=True,
        max_age=86400,
        samesite="lax",
        secure=False # Set to True in production HTTPS
    )

    return schemas.TokenResponse(
        access_token=token,
        token_type="bearer",
        user=schemas.UserResponse.model_validate(new_user)
    )

@router.post("/login", response_model=schemas.TokenResponse)
def login_user(
    data: schemas.UserLogin,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    # Apply rate limiting on login attempts
    check_login_rate_limit(request)

    user = db.query(models.User).filter(models.User.email == data.email.lower().strip()).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated."
        )

    # Ensure user has a cart
    cart = db.query(models.Cart).filter(models.Cart.user_id == user.id).first()
    if not cart:
        cart = models.Cart(user_id=user.id)
        db.add(cart)
        db.commit()

    # Generate token
    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})

    # Set secure cookie
    response.set_cookie(
        key="ikea_access_token",
        value=token,
        httponly=True,
        max_age=86400,
        samesite="lax",
        secure=False
    )

    return schemas.TokenResponse(
        access_token=token,
        token_type="bearer",
        user=schemas.UserResponse.model_validate(user)
    )

@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_profile(user: models.User = Depends(get_current_user)):
    return schemas.UserResponse.model_validate(user)

@router.post("/logout")
def logout_user(response: Response):
    response.delete_cookie(key="ikea_access_token")
    return {"message": "Successfully logged out of your session."}

@router.post("/forgot-password")
def request_password_reset(
    data: schemas.ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == data.email.lower().strip()).first()
    if not user:
        # Prevent user enumeration: always return standard success message
        return {
            "message": "If an account exists with this email, a password reset link has been dispatched.",
            "status": "dispatched"
        }

    # Generate secure 32-byte URL-safe token
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(hours=1)

    # Invalidate previous unused tokens for this user
    db.query(models.PasswordResetToken).filter(
        models.PasswordResetToken.user_id == user.id,
        models.PasswordResetToken.is_used == False
    ).update({"is_used": True})

    token_record = models.PasswordResetToken(
        user_id=user.id,
        token=reset_token,
        expires_at=expires_at,
        is_used=False
    )
    db.add(token_record)
    db.commit()

    # In production, send email via Cloudflare Email Service or SendGrid.
    # For demo, include the reset token / stub URL so user can complete flow.
    return {
        "message": "If an account exists with this email, a password reset link has been dispatched.",
        "status": "dispatched",
        "demo_reset_token": reset_token, # Available for demo testing
        "expires_in_minutes": 60
    }

@router.post("/reset-password")
def reset_password(
    data: schemas.ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    token_record = db.query(models.PasswordResetToken).filter(
        models.PasswordResetToken.token == data.token,
        models.PasswordResetToken.is_used == False,
        models.PasswordResetToken.expires_at > datetime.datetime.utcnow()
    ).first()

    if not token_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The password reset link is invalid or has expired. Please request a new one."
        )

    user = db.query(models.User).filter(models.User.id == token_record.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found.")

    # Update password with new bcrypt hash
    user.hashed_password = hash_password(data.new_password)
    token_record.is_used = True
    db.commit()

    return {"message": "Your password has been updated successfully. You can now log in with your new credentials."}
