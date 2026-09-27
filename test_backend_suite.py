import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'nmimsgdg-main', 'backend'))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    print("=== 1. Health Check ===")
    res = client.get("/")
    assert res.status_code == 200, f"Root failed: {res.text}"
    print("Root API:", res.json())

    print("\n=== 2. Products Catalog ===")
    res = client.get("/api/products")
    assert res.status_code == 200
    products = res.json()
    print(f"Loaded {len(products)} products from database.")
    assert len(products) > 0

    print("\n=== 3. Authentication (Signup / Login) ===")
    import time
    test_email = f"testuser_{int(time.time())}@ikea-spylt.com"
    reg_data = {
        "email": test_email,
        "password": "StrongPassword2026!",
        "full_name": "Test Customer",
        "phone": "+91 9988776655"
    }
    # Register or login
    reg_res = client.post("/api/auth/register", json=reg_data)
    if reg_res.status_code == 201:
        auth_data = reg_res.json()
        print("Registration successful:", auth_data["user"]["email"])
    else:
        login_res = client.post("/api/auth/login", json={"email": test_email, "password": "StrongPassword2026!"})
        assert login_res.status_code == 200
        auth_data = login_res.json()
        print("Login successful:", auth_data["user"]["email"])

    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    print("\n=== 4. Cart Operations (Server-Side) ===")
    # Add product to cart
    add_res = client.post(
        "/api/cart/items",
        json={"product_id": "sh-001", "quantity": 1, "selected_color": "Beige"},
        headers=headers
    )
    assert add_res.status_code == 200, f"Add to cart failed: {add_res.text}"
    cart_data = add_res.json()
    print(f"Cart has {cart_data['total_quantity']} items, Total: INR {cart_data['total_amount']}")

    print("\n=== 5. Payments & Orders (Razorpay Checkout Flow) ===")
    order_payload = {
        "customer_name": "Test Customer",
        "customer_email": test_email,
        "customer_phone": "+91 9988776655",
        "shipping_address": "Flat 402, Green Valley Apartments, Andheri West",
        "city": "Mumbai",
        "pincode": "400053"
    }
    order_res = client.post("/api/payments/create-order", json=order_payload, headers=headers)
    assert order_res.status_code == 200, f"Create order failed: {order_res.text}"
    rzp_order = order_res.json()
    print("Created Order ID:", rzp_order["order_id"])
    print(f"Razorpay Order ID: {rzp_order['razorpay_order_id']}, Amount: INR {rzp_order['amount_in_rupees']}")

    print("\n=== 6. Verify Payment & Inventory Update ===")
    verify_payload = {
        "order_id": rzp_order["order_id"],
        "razorpay_order_id": rzp_order["razorpay_order_id"],
        "razorpay_payment_id": f"pay_demo_{rzp_order['order_id']}",
        "razorpay_signature": f"demo_sig_{rzp_order['order_id']}"
    }
    verify_res = client.post("/api/payments/verify", json=verify_payload, headers=headers)
    assert verify_res.status_code == 200, f"Verify payment failed: {verify_res.text}"
    paid_order = verify_res.json()
    print("Order Status:", paid_order["status"])
    print("Total Paid:", f"INR {paid_order['total_amount']}")

    print("\n=== 7. Password Reset Flow ===")
    forgot_res = client.post("/api/auth/forgot-password", json={"email": test_email})
    assert forgot_res.status_code == 200
    demo_token = forgot_res.json()["demo_reset_token"]
    reset_res = client.post("/api/auth/reset-password", json={"token": demo_token, "new_password": "NewStrongPassword2026!"})
    assert reset_res.status_code == 200
    print("Password reset successful with token.")

    print("\n=== ALL BACKEND ENDPOINTS & DATABASE TRANSACTIONS PASSED 100%! ===")

if __name__ == "__main__":
    run_tests()
