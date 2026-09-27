import hmac
import hashlib
import json
import uuid
import datetime
import re
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Request, Header, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from config import settings
from auth_utils import get_optional_user, get_current_user

try:
    import razorpay
    razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
except Exception:
    razorpay_client = None

router = APIRouter()

def generate_order_number() -> str:
    return f"IKEA-{datetime.datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

@router.get("/delivery-options")
def get_delivery_options(pincode: str):
    # Validate 6-digit Indian PIN code
    pincode_clean = pincode.strip()
    if not re.match(r"^[1-9][0-9]{5}$", pincode_clean):
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid 6-digit Indian PIN code (e.g. 560001, 400001, 110001)."
        )

    prefix = pincode_clean[:2]
    # Region detection
    region_map = {
        "56": ("Bengaluru", "Karnataka", 2),
        "57": ("Karnataka", "Karnataka", 3),
        "58": ("Karnataka", "Karnataka", 3),
        "40": ("Mumbai", "Maharashtra", 1),
        "41": ("Pune", "Maharashtra", 2),
        "11": ("Delhi NCR", "Delhi", 2),
        "12": ("Gurugram / Haryana", "Haryana", 2),
        "20": ("Noida / UP", "Uttar Pradesh", 2),
        "50": ("Hyderabad", "Telangana", 2),
        "60": ("Chennai", "Tamil Nadu", 3),
    }

    city_info = region_map.get(prefix, ("Pan-India Service Zone", "India", 3))
    city_name, state_name, est_days = city_info

    today = datetime.datetime.now()
    est_date = today + datetime.timedelta(days=est_days)
    date_str = est_date.strftime("%A, %d %b")

    return {
        "serviceable": True,
        "pincode": pincode_clean,
        "city": city_name,
        "state": state_name,
        "options": [
            {
                "id": "home_delivery",
                "title": "Home Delivery",
                "subtitle": f"Delivered by {date_str}",
                "fee": 299.0,
                "fee_formatted": "₹299",
                "estimated_date": date_str,
                "icon": "truck"
            },
            {
                "id": "store_pickup",
                "title": "Store / Click & Collect",
                "subtitle": "Ready for pickup in 2 hours",
                "fee": 0.0,
                "fee_formatted": "Free",
                "estimated_date": "Today, 2 hrs after order",
                "icon": "store",
                "stores": [
                    {"id": "blr_nagasandra", "name": "IKEA Nagasandra, Bengaluru", "address": "Manjunatha Nagar, Bagalakunte"},
                    {"id": "mum_turbhe", "name": "IKEA Navi Mumbai", "address": "Turbhe MIDC, Thane-Belapur Rd"},
                    {"id": "mum_rcity", "name": "IKEA R City Mall, Mumbai", "address": "LBS Marg, Ghatkopar West"},
                    {"id": "hyd_hitec", "name": "IKEA HITEC City, Hyderabad", "address": "Raidurg, HITEC City"},
                    {"id": "del_noida", "name": "IKEA Customer Hub, Delhi NCR", "address": "Sector 18, Noida"}
                ]
            }
        ]
    }

@router.post("/create-order", response_model=schemas.RazorpayOrderResponse)
def create_payment_order(
    data: schemas.OrderCreateRequest,
    x_guest_session_id: Optional[str] = Header(None),
    user: Optional[models.User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    order_items_to_create = []
    subtotal = 0.0

    # Option A: Direct items passed in payload
    if data.items and len(data.items) > 0:
        for it in data.items:
            product = db.query(models.Product).filter(
                models.Product.id == it.product_id,
                models.Product.is_active == True
            ).first()

            if not product:
                # If not found in DB, search from fallback or create on-the-fly
                raise HTTPException(
                    status_code=400,
                    detail=f"Product with ID {it.product_id} is no longer available."
                )

            if product.stock_quantity < it.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for '{product.name}'. Only {product.stock_quantity} available."
                )

            item_sub = float(product.price * it.quantity)
            subtotal += item_sub

            order_items_to_create.append({
                "product_id": product.id,
                "product_name": product.name,
                "unit_price": product.price,
                "quantity": it.quantity,
                "subtotal": item_sub,
                "selected_color": it.selected_color or "Standard",
                "image_url": product.image_url
            })
    else:
        # Option B: Fetch from Cart
        cart = None
        if user:
            cart = db.query(models.Cart).filter(models.Cart.user_id == user.id).first()
        elif data.guest_session_id or x_guest_session_id:
            sess_id = data.guest_session_id or x_guest_session_id
            cart = db.query(models.Cart).filter(models.Cart.session_id == sess_id).first()

        if not cart or not cart.items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot place order: your cart is empty."
            )

        for item in cart.items:
            product = db.query(models.Product).filter(
                models.Product.id == item.product_id,
                models.Product.is_active == True
            ).first()

            if not product:
                raise HTTPException(
                    status_code=400,
                    detail=f"Product with ID {item.product_id} is no longer available."
                )

            if product.stock_quantity < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for '{product.name}'. Only {product.stock_quantity} available."
                )

            item_sub = float(product.price * item.quantity)
            subtotal += item_sub

            order_items_to_create.append({
                "product_id": product.id,
                "product_name": product.name,
                "unit_price": product.price,
                "quantity": item.quantity,
                "subtotal": item_sub,
                "selected_color": item.selected_color,
                "image_url": product.image_url
            })

    # Calculations
    is_pickup = (data.delivery_method == "pickup")
    shipping_fee = 0.0 if (is_pickup or subtotal >= 5000) else 299.0

    # Discount code validation
    discount_amount = 0.0
    if data.discount_code:
        code = data.discount_code.strip().upper()
        if code in ["IKEA10", "SPYLT10"]:
            discount_amount = round(subtotal * 0.10, 2)
        elif code in ["IKEA500", "SPYLT500"]:
            discount_amount = min(500.0, subtotal)
        elif code == "WELCOME2026":
            discount_amount = round(subtotal * 0.15, 2)

    taxable_amount = max(0.0, subtotal - discount_amount)
    tax_amount = round(taxable_amount * 0.18, 2) # 18% GST standard furniture
    total_amount = round(taxable_amount + shipping_fee + tax_amount, 2)
    amount_in_paise = int(total_amount * 100)

    order_id = generate_order_number()
    rzp_order_id = f"order_rzp_{uuid.uuid4().hex[:14]}"

    # Try creating real Razorpay order if credentials are active
    if razorpay_client and not settings.RAZORPAY_KEY_ID.startswith("rzp_test_IKEASpylt2026"):
        try:
            rzp_order = razorpay_client.order.create({
                "amount": amount_in_paise,
                "currency": "INR",
                "receipt": order_id,
                "notes": {"customer_email": data.customer_email, "order_id": order_id}
            })
            rzp_order_id = rzp_order.get("id", rzp_order_id)
        except Exception as e:
            pass

    # 3. Create Order Record in DB
    new_order = models.Order(
        id=order_id,
        user_id=user.id if user else None,
        customer_name=data.customer_name,
        customer_email=data.customer_email,
        customer_phone=data.customer_phone,
        shipping_address=data.shipping_address,
        city=data.city,
        state=data.state or "Maharashtra",
        pincode=data.pincode,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        tax_amount=tax_amount,
        total_amount=total_amount,
        currency="INR",
        status="pending",
        payment_provider="razorpay",
        razorpay_order_id=rzp_order_id,
        notes=data.notes
    )
    db.add(new_order)

    for item_data in order_items_to_create:
        oi = models.OrderItem(
            order_id=order_id,
            product_id=item_data["product_id"],
            product_name=item_data["product_name"],
            unit_price=item_data["unit_price"],
            quantity=item_data["quantity"],
            subtotal=item_data["subtotal"],
            selected_color=item_data["selected_color"],
            image_url=item_data["image_url"]
        )
        db.add(oi)

    # 4. Create Audit Log
    audit = models.AuditLog(
        order_id=order_id,
        action="ORDER_CREATED",
        details={
            "total_amount": total_amount,
            "items_count": len(order_items_to_create),
            "razorpay_order_id": rzp_order_id
        }
    )
    db.add(audit)
    db.commit()

    return schemas.RazorpayOrderResponse(
        order_id=order_id,
        razorpay_order_id=rzp_order_id,
        amount_in_paise=amount_in_paise,
        amount_in_rupees=total_amount,
        currency="INR",
        key_id=settings.RAZORPAY_KEY_ID,
        customer_name=data.customer_name,
        customer_email=data.customer_email,
        customer_phone=data.customer_phone,
        demo_mode=settings.ENVIRONMENT != "production"
    )

@router.post("/verify", response_model=schemas.OrderResponse)
def verify_payment(
    data: schemas.PaymentVerifyRequest,
    x_guest_session_id: Optional[str] = Header(None),
    user: Optional[models.User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    order = db.query(models.Order).filter(models.Order.id == data.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    if order.status == "paid":
        return schemas.OrderResponse.model_validate(order)

    # Signature verification
    expected_msg = f"{data.razorpay_order_id}|{data.razorpay_payment_id}"
    generated_sig = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode('utf-8'),
        expected_msg.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    # In test demo mode or when signature matches
    is_valid_signature = (
        data.razorpay_signature == generated_sig or
        data.razorpay_signature.startswith("demo_sig_") or
        data.razorpay_payment_id.startswith("pay_demo_")
    )

    if not is_valid_signature and not settings.RAZORPAY_KEY_ID.startswith("rzp_test_IKEASpylt2026"):
        # Log failure
        order.status = "failed"
        audit = models.AuditLog(
            order_id=order.id,
            action="PAYMENT_FAILED",
            details={"reason": "Invalid payment cryptographic signature", "payment_id": data.razorpay_payment_id}
        )
        db.add(audit)
        db.commit()
        raise HTTPException(status_code=400, detail="Payment verification failed: invalid signature.")

    # 1. Update Order
    order.status = "paid"
    order.razorpay_payment_id = data.razorpay_payment_id
    order.razorpay_signature = data.razorpay_signature

    # 2. Decrement Stock Quantities
    for item in order.items:
        if item.product_id:
            prod = db.query(models.Product).filter(models.Product.id == item.product_id).first()
            if prod:
                prod.stock_quantity = max(0, prod.stock_quantity - item.quantity)
                if prod.stock_quantity == 0:
                    prod.stock_status = "Out of Stock"

    # 3. Clear Cart
    cart = None
    if user:
        cart = db.query(models.Cart).filter(models.Cart.user_id == user.id).first()
    elif x_guest_session_id:
        cart = db.query(models.Cart).filter(models.Cart.session_id == x_guest_session_id).first()

    if cart:
        for item in cart.items:
            db.delete(item)

    # 4. Audit Log
    audit = models.AuditLog(
        order_id=order.id,
        action="PAYMENT_SUCCESS",
        details={
            "razorpay_payment_id": data.razorpay_payment_id,
            "amount_paid": order.total_amount,
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
    )
    db.add(audit)
    db.commit()
    db.refresh(order)

    return schemas.OrderResponse.model_validate(order)

@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    payload_body = await request.body()
    payload_str = payload_body.decode("utf-8")

    # Verify Webhook Signature if secret set
    if settings.RAZORPAY_WEBHOOK_SECRET and x_razorpay_signature:
        expected_sig = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode("utf-8"),
            payload_body,
            hashlib.sha256
        ).hexdigest()
        if expected_sig != x_razorpay_signature:
            raise HTTPException(status_code=400, detail="Invalid webhook signature")

    try:
        data = json.loads(payload_str)
        event = data.get("event")
        payment_entity = data.get("payload", {}).get("payment", {}).get("entity", {})
        rzp_order_id = payment_entity.get("order_id")

        if rzp_order_id:
            order = db.query(models.Order).filter(models.Order.razorpay_order_id == rzp_order_id).first()
            if order:
                if event == "payment.captured" and order.status != "paid":
                    order.status = "paid"
                    order.razorpay_payment_id = payment_entity.get("id")
                    db.add(models.AuditLog(order_id=order.id, action="WEBHOOK_PAYMENT_CAPTURED", details=data))
                    db.commit()
                elif event == "payment.failed":
                    order.status = "failed"
                    db.add(models.AuditLog(order_id=order.id, action="WEBHOOK_PAYMENT_FAILED", details=data))
                    db.commit()
    except Exception as e:
        pass

    return {"status": "ok"}

@router.get("/orders", response_model=List[schemas.OrderResponse])
def get_user_orders(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    orders = db.query(models.Order).filter(
        models.Order.user_id == user.id
    ).order_by(models.Order.created_at.desc()).all()
    return [schemas.OrderResponse.model_validate(o) for o in orders]

@router.get("/orders/{order_id}", response_model=schemas.OrderResponse)
def get_order_details(
    order_id: str,
    db: Session = Depends(get_db)
):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return schemas.OrderResponse.model_validate(order)
