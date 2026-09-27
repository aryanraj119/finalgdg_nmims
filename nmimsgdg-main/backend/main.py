from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models
from seed_data import seed_database
from api import rooms, reconstruction, furniture, auth, products, cart, payments

# Initialize database tables and seed catalog data on startup
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title="IKEA & SPYLT Full E-Commerce Platform API",
    description="Production-grade API featuring Database, Auth (JWT + Bcrypt), Real-Time Server Cart, and Razorpay Payments (Test Mode).",
    version="2.0.0"
)

# Enable CORS for Frontend (IKEA store & SPYLT 3D Hub)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication & User Management
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

# Product Catalog
app.include_router(products.router, prefix="/api/products", tags=["Products"])

# Real-Time Cart with Server-Side Validation
app.include_router(cart.router, prefix="/api/cart", tags=["Cart"])

# Orders & Razorpay Payments
app.include_router(payments.router, prefix="/api/payments", tags=["Payments & Orders"])

# Existing 3D AI & Reconstruction Services (Preserved)
app.include_router(rooms.router, prefix="/api/rooms", tags=["Rooms 3D"])
app.include_router(reconstruction.router, prefix="/api/reconstruction", tags=["VGGT Reconstruction"])
app.include_router(furniture.router, prefix="/api/furniture", tags=["Furniture AI"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "IKEA & SPYLT E-Commerce Backend",
        "version": "2.0.0",
        "database": "SQLAlchemy + SQLite/Postgres Ready",
        "auth_enabled": True,
        "cart_sync_enabled": True,
        "payments_enabled": True,
        "razorpay_mode": "test"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
