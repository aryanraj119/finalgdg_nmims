from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List, Dict, Any
import datetime
import re

# ==================== AUTH SCHEMAS ====================
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    full_name: Optional[str] = None
    phone: Optional[str] = None

    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r"[A-Za-z]", v):
            raise ValueError('Password must contain at least one letter')
        if not re.search(r"\d", v):
            raise ValueError('Password must contain at least one number')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

    @field_validator('new_password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r"[A-Za-z]", v) or not re.search(r"\d", v):
            raise ValueError('Password must contain letters and numbers')
        return v


# ==================== PRODUCT SCHEMAS ====================
class ProductBase(BaseModel):
    id: str
    name: str
    category: str
    sub_category: Optional[str] = None
    type: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    ikea_family_price: Optional[float] = None
    is_ikea_family: bool = False
    is_second_hand: bool = False
    condition: Optional[str] = "Brand New"
    description: Optional[str] = None
    dimensions: Optional[str] = None
    material: Optional[str] = None
    stock_quantity: int = 50
    stock_status: Optional[str] = "In Stock"
    image_url: Optional[str] = None
    badge: Optional[str] = None
    rating: Optional[float] = 4.8
    reviews_count: Optional[int] = 100
    stores: Optional[Any] = []
    colors: Optional[Any] = []
    tags: Optional[Any] = []

class ProductResponse(ProductBase):
    is_active: bool = True
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True


# ==================== CART SCHEMAS ====================
class CartItemAdd(BaseModel):
    product_id: str
    quantity: int = Field(1, ge=1, le=20)
    selected_color: Optional[str] = None

class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=1, le=20)
    selected_color: Optional[str] = None

class CartItemResponse(BaseModel):
    id: str
    product_id: str
    quantity: int
    selected_color: Optional[str] = None
    product: Optional[ProductResponse] = None
    subtotal: float

    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    items: List[CartItemResponse] = []
    total_quantity: int = 0
    total_amount: float = 0.0

    class Config:
        from_attributes = True

class CartMergeRequest(BaseModel):
    guest_session_id: str


# ==================== ORDER & PAYMENT SCHEMAS ====================
class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(1, ge=1)
    selected_color: Optional[str] = None

class OrderCreateRequest(BaseModel):
    customer_name: str = Field(..., min_length=2)
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=10)
    shipping_address: str = Field(..., min_length=5)
    city: str = Field(..., min_length=2)
    state: Optional[str] = "Maharashtra"
    pincode: str = Field(..., min_length=6)
    guest_session_id: Optional[str] = None # If checking out as guest
    delivery_method: Optional[str] = "delivery" # "delivery" or "pickup"
    pickup_store: Optional[str] = None
    discount_code: Optional[str] = None
    items: Optional[List[OrderItemCreate]] = None
    notes: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: str
    product_id: Optional[str]
    product_name: str
    unit_price: float
    quantity: int
    subtotal: float
    selected_color: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: str
    customer_name: str
    customer_email: str
    customer_phone: Optional[str]
    shipping_address: str
    city: str
    pincode: str
    subtotal: float
    shipping_fee: float
    tax_amount: float
    total_amount: float
    currency: str
    status: str
    payment_provider: str
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    created_at: datetime.datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

class RazorpayOrderResponse(BaseModel):
    order_id: str
    razorpay_order_id: str
    amount_in_paise: int
    amount_in_rupees: float
    currency: str = "INR"
    key_id: str
    customer_name: str
    customer_email: str
    customer_phone: Optional[str]
    demo_mode: bool = True

class PaymentVerifyRequest(BaseModel):
    order_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
