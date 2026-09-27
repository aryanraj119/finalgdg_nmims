from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth_utils import get_optional_user, get_current_user

router = APIRouter()

def get_or_create_cart(
    db: Session,
    user: Optional[models.User] = None,
    guest_session_id: Optional[str] = None
) -> models.Cart:
    if user:
        cart = db.query(models.Cart).filter(models.Cart.user_id == user.id).first()
        if not cart:
            cart = models.Cart(user_id=user.id)
            db.add(cart)
            db.commit()
            db.refresh(cart)
        return cart

    if guest_session_id:
        cart = db.query(models.Cart).filter(models.Cart.session_id == guest_session_id).first()
        if not cart:
            cart = models.Cart(session_id=guest_session_id)
            db.add(cart)
            db.commit()
            db.refresh(cart)
        return cart

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Must provide an authenticated session or a guest session ID."
    )

def build_cart_response(cart: models.Cart) -> schemas.CartResponse:
    items_response = []
    total_qty = 0
    total_amt = 0.0

    for item in cart.items:
        if item.product and item.product.is_active:
            sub = float(item.product.price * item.quantity)
            total_qty += item.quantity
            total_amt += sub

            items_response.append(
                schemas.CartItemResponse(
                    id=item.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    selected_color=item.selected_color,
                    product=schemas.ProductResponse.model_validate(item.product),
                    subtotal=round(sub, 2)
                )
            )

    return schemas.CartResponse(
        id=cart.id,
        user_id=cart.user_id,
        session_id=cart.session_id,
        items=items_response,
        total_quantity=total_qty,
        total_amount=round(total_amt, 2)
    )

@router.get("", response_model=schemas.CartResponse)
def get_cart(
    x_guest_session_id: Optional[str] = Header(None),
    user: Optional[models.User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    cart = get_or_create_cart(db, user, x_guest_session_id)
    return build_cart_response(cart)

@router.post("/items", response_model=schemas.CartResponse)
def add_item_to_cart(
    data: schemas.CartItemAdd,
    x_guest_session_id: Optional[str] = Header(None),
    user: Optional[models.User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    # 1. Validate Product Existence & Stock
    product = db.query(models.Product).filter(
        models.Product.id == data.product_id,
        models.Product.is_active == True
    ).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{data.product_id}' is not available."
        )

    if product.stock_quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{product.name}' is currently out of stock."
        )

    cart = get_or_create_cart(db, user, x_guest_session_id)

    # Check if item already in cart
    existing_item = db.query(models.CartItem).filter(
        models.CartItem.cart_id == cart.id,
        models.CartItem.product_id == data.product_id,
        models.CartItem.selected_color == data.selected_color
    ).first()

    if existing_item:
        new_quantity = existing_item.quantity + data.quantity
        if new_quantity > product.stock_quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot add {data.quantity} more. Only {product.stock_quantity} available in stock."
            )
        existing_item.quantity = new_quantity
    else:
        if data.quantity > product.stock_quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only {product.stock_quantity} available in stock."
            )
        new_item = models.CartItem(
            cart_id=cart.id,
            product_id=data.product_id,
            quantity=data.quantity,
            selected_color=data.selected_color
        )
        db.add(new_item)

    db.commit()
    db.refresh(cart)
    return build_cart_response(cart)

@router.put("/items/{item_id}", response_model=schemas.CartResponse)
def update_cart_item(
    item_id: str,
    data: schemas.CartItemUpdate,
    x_guest_session_id: Optional[str] = Header(None),
    user: Optional[models.User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    cart = get_or_create_cart(db, user, x_guest_session_id)
    item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.cart_id == cart.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found.")

    if data.quantity > item.product.stock_quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Only {item.product.stock_quantity} units available in stock."
        )

    item.quantity = data.quantity
    if data.selected_color:
        item.selected_color = data.selected_color

    db.commit()
    db.refresh(cart)
    return build_cart_response(cart)

@router.delete("/items/{item_id}", response_model=schemas.CartResponse)
def remove_cart_item(
    item_id: str,
    x_guest_session_id: Optional[str] = Header(None),
    user: Optional[models.User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    cart = get_or_create_cart(db, user, x_guest_session_id)
    item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.cart_id == cart.id
    ).first()

    if item:
        db.delete(item)
        db.commit()
        db.refresh(cart)

    return build_cart_response(cart)

@router.post("/merge", response_model=schemas.CartResponse)
def merge_guest_cart(
    data: schemas.CartMergeRequest,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Merges a guest session cart into the logged-in user account cart"""
    guest_cart = db.query(models.Cart).filter(models.Cart.session_id == data.guest_session_id).first()
    user_cart = get_or_create_cart(db, user=user)

    if guest_cart and guest_cart.items:
        for g_item in guest_cart.items:
            # Check if user already has item
            existing = db.query(models.CartItem).filter(
                models.CartItem.cart_id == user_cart.id,
                models.CartItem.product_id == g_item.product_id,
                models.CartItem.selected_color == g_item.selected_color
            ).first()

            if existing:
                existing.quantity = min(
                    existing.quantity + g_item.quantity,
                    g_item.product.stock_quantity if g_item.product else 20
                )
            else:
                new_item = models.CartItem(
                    cart_id=user_cart.id,
                    product_id=g_item.product_id,
                    quantity=g_item.quantity,
                    selected_color=g_item.selected_color
                )
                db.add(new_item)

        # Remove guest cart items and delete guest cart
        db.delete(guest_cart)
        db.commit()
        db.refresh(user_cart)

    return build_cart_response(user_cart)

@router.post("/clear", response_model=schemas.CartResponse)
def clear_cart(
    x_guest_session_id: Optional[str] = Header(None),
    user: Optional[models.User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    cart = get_or_create_cart(db, user, x_guest_session_id)
    for item in cart.items:
        db.delete(item)
    db.commit()
    db.refresh(cart)
    return build_cart_response(cart)
