import json
import re
from sqlalchemy.orm import Session
from database import SessionLocal, Base, engine
import models
from auth_utils import hash_password

INITIAL_PRODUCTS = [
    {
        "id": "ikea-001",
        "name": "STRANDMON Wing Chair",
        "category": "Living Room",
        "sub_category": "Armchairs",
        "type": "Wing chair",
        "price": 18990.0,
        "original_price": 21990.0,
        "ikea_family_price": 16990.0,
        "is_ikea_family": True,
        "is_second_hand": False,
        "condition": "Brand New",
        "description": "You can really loosen up and relax in comfort because the high back on this chair provides extra support for your neck.",
        "dimensions": "82x96x101 cm",
        "material": "100% polyester fabric, Solid beech frame, Polyurethane foam",
        "stock_quantity": 45,
        "stock_status": "In Stock",
        "badge": "Special Offer",
        "rating": 4.8,
        "reviews_count": 342,
        "stores": ["Navi Mumbai", "Hyderabad", "Bengaluru", "Worli"],
        "colors": ["#1e3a5f", "#3c503c", "#f3e5ab", "#333333"],
        "image_url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
        "tags": ["living room", "chair", "armchair", "seating", "strandmon"]
    },
    {
        "id": "ikea-002",
        "name": "BILLY Bookcase",
        "category": "Storage",
        "sub_category": "Bookcases",
        "type": "Bookcase with glass doors",
        "price": 7990.0,
        "original_price": 8990.0,
        "ikea_family_price": 6990.0,
        "is_ikea_family": True,
        "is_second_hand": False,
        "condition": "Brand New",
        "description": "It is estimated that every 5 seconds, one BILLY bookcase is sold somewhere in the world. Pretty impressive considering we launched BILLY in 1979.",
        "dimensions": "80x28x202 cm",
        "material": "Particleboard, Paper foil, Plastic edging",
        "stock_quantity": 80,
        "stock_status": "In Stock",
        "badge": "Top Seller",
        "rating": 4.9,
        "reviews_count": 819,
        "stores": ["Navi Mumbai", "Hyderabad", "Bengaluru", "Worli", "R City"],
        "colors": ["#ffffff", "#2b1e17", "#d9b382"],
        "image_url": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
        "tags": ["storage", "bookcase", "shelving", "living room", "billy"]
    },
    {
        "id": "ikea-003",
        "name": "MALM High Bed Frame",
        "category": "Bedroom",
        "sub_category": "Beds",
        "type": "Bed frame, high, with 2 storage boxes",
        "price": 24990.0,
        "original_price": 27990.0,
        "ikea_family_price": 22990.0,
        "is_ikea_family": True,
        "is_second_hand": False,
        "condition": "Brand New",
        "description": "A clean design that's just as beautiful on all sides – place the bed freestanding or with the headboard against a wall. Generous storage drawers glide quietly.",
        "dimensions": "180x200 cm (King Size)",
        "material": "Particleboard, Solid wood veneer, Clear acrylic lacquer",
        "stock_quantity": 30,
        "stock_status": "In Stock",
        "badge": "Great Value",
        "rating": 4.7,
        "reviews_count": 512,
        "stores": ["Navi Mumbai", "Hyderabad", "Bengaluru"],
        "colors": ["#ffffff", "#3b2f2f", "#d2b48c"],
        "image_url": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
        "tags": ["bedroom", "bed", "storage", "king size", "malm"]
    },
    {
        "id": "ikea-004",
        "name": "KALLAX Shelving Unit 4x4",
        "category": "Storage",
        "sub_category": "Shelving units",
        "type": "Shelving unit, 4x4 squares",
        "price": 9990.0,
        "original_price": 11490.0,
        "ikea_family_price": None,
        "is_ikea_family": False,
        "is_second_hand": False,
        "condition": "Brand New",
        "description": "Standing or lying – the KALLAX series adapts to taste, space, budget and needs. Fine-tune with drawers, shelves, boxes and inserts.",
        "dimensions": "147x147 cm",
        "material": "Particleboard, Fibreboard, Acrylic paint",
        "stock_quantity": 55,
        "stock_status": "In Stock",
        "badge": "New Lower Price",
        "rating": 4.9,
        "reviews_count": 624,
        "stores": ["Navi Mumbai", "Hyderabad", "Bengaluru", "Worli"],
        "colors": ["#ffffff", "#1a1a1a", "#9c7c58"],
        "image_url": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
        "tags": ["storage", "shelving", "kallax"]
    },
    # SECOND-HAND CIRCULAR HUB PRODUCTS
    {
        "id": "sh-001",
        "name": "POÄNG Armchair (Pre-Loved)",
        "category": "Living Room",
        "sub_category": "Second-Hand Armchairs",
        "type": "Armchair with birch veneer frame",
        "price": 4490.0,
        "original_price": 9990.0,
        "ikea_family_price": 3990.0,
        "is_ikea_family": True,
        "is_second_hand": True,
        "condition": "Like New",
        "description": "Layer-glued bent oak frame provides relaxing resilience. Upholstered in freshly steam-cleaned Knisa light beige cushion. Verified 24-point circular inspection.",
        "dimensions": "68x82x100 cm",
        "material": "Layer-glued wood veneer, Polyester cushion",
        "stock_quantity": 4,
        "stock_status": "In Stock",
        "badge": "55% OFF • Verified Second-Hand",
        "rating": 4.9,
        "reviews_count": 88,
        "stores": ["Navi Mumbai Circular Hub", "Bengaluru Hub"],
        "colors": ["#e8ded1", "#333333"],
        "image_url": "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80",
        "tags": ["secondhand", "circular", "chair", "poang", "sustainable"]
    },
    {
        "id": "sh-002",
        "name": "HEMNES 8-Drawer Dresser (Refurbished)",
        "category": "Bedroom",
        "sub_category": "Second-Hand Dressers",
        "type": "8-drawer chest, solid pine",
        "price": 14990.0,
        "original_price": 27990.0,
        "ikea_family_price": 13990.0,
        "is_ikea_family": True,
        "is_second_hand": True,
        "condition": "Excellent",
        "description": "Solid wood with authentic character. Refinished with non-toxic matte lacquer. Deep drawers with smooth running drawer stops.",
        "dimensions": "160x50x96 cm",
        "material": "Solid pine wood, Stained clear acrylic lacquer",
        "stock_quantity": 2,
        "stock_status": "Low Stock",
        "badge": "46% OFF • Circular Hub",
        "rating": 4.8,
        "reviews_count": 45,
        "stores": ["Hyderabad Hub", "Navi Mumbai Hub"],
        "colors": ["#ffffff", "#2b1e17"],
        "image_url": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
        "tags": ["secondhand", "dresser", "storage", "hemnes"]
    },
    {
        "id": "sh-003",
        "name": "NORDVIKEN Extendable Table (Pre-Loved)",
        "category": "Dining",
        "sub_category": "Dining Tables",
        "type": "Extendable wooden table, seats 6-8",
        "price": 19990.0,
        "original_price": 39990.0,
        "ikea_family_price": 18490.0,
        "is_ikea_family": True,
        "is_second_hand": True,
        "condition": "Good",
        "description": "A spacious wooden dining table with a traditional look that easily extends to seat 8 people. Minor patina on surface adds warm charm.",
        "dimensions": "210/289x105 cm",
        "material": "Solid pine, Clear acrylic stain",
        "stock_quantity": 3,
        "stock_status": "In Stock",
        "badge": "50% OFF • Certified Re-Use",
        "rating": 4.7,
        "reviews_count": 39,
        "stores": ["Bengaluru Hub", "Worli Hub"],
        "colors": ["#4a3525", "#ffffff"],
        "image_url": "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80",
        "tags": ["secondhand", "dining", "table", "nordviken"]
    },
    {
        "id": "sh-004",
        "name": "MARKUS Ergonomic Office Chair (Refurbished)",
        "category": "Office",
        "sub_category": "Desk Chairs",
        "type": "High-back mesh ergonomic desk chair",
        "price": 7990.0,
        "original_price": 15990.0,
        "ikea_family_price": 7490.0,
        "is_ikea_family": True,
        "is_second_hand": True,
        "condition": "Like New",
        "description": "Adjustable height and angle with synchrone tilt mechanism. Breathable back mesh with lumbar support. Tested for 110kg commercial use.",
        "dimensions": "62x60x140 cm",
        "material": "Polyester mesh, Steel frame, Cast aluminium base",
        "stock_quantity": 8,
        "stock_status": "In Stock",
        "badge": "50% OFF • Certified Second-Hand",
        "rating": 4.9,
        "reviews_count": 142,
        "stores": ["Navi Mumbai", "Hyderabad", "Bengaluru"],
        "colors": ["#1a1a1a", "#708090"],
        "image_url": "https://images.unsplash.com/photo-1580481077195-c3f2533c09b0?auto=format&fit=crop&w=800&q=80",
        "tags": ["secondhand", "office", "chair", "markus", "ergonomic"]
    }
]

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # Seed Demo Admin User
        admin_email = "demo@ikea-spylt.com"
        admin_user = db.query(models.User).filter(models.User.email == admin_email).first()
        if not admin_user:
            admin_user = models.User(
                email=admin_email,
                hashed_password=hash_password("IkeaDemo2026!"),
                full_name="IKEA Family Member",
                phone="+91 98765 43210",
                role="customer",
                is_active=True,
                is_verified=True
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)

            # Create cart
            user_cart = models.Cart(user_id=admin_user.id)
            db.add(user_cart)
            db.commit()
            print(f"Created default user: {admin_email} (Password: IkeaDemo2026!)")

        # Seed Products
        added_count = 0
        for p_data in INITIAL_PRODUCTS:
            prod = db.query(models.Product).filter(models.Product.id == p_data["id"]).first()
            if not prod:
                new_prod = models.Product(**p_data)
                db.add(new_prod)
                added_count += 1
            elif prod.stock_quantity < 5:
                prod.stock_quantity = p_data.get("stock_quantity", 25)
                prod.stock_status = "In Stock"

        db.commit()
        print(f"Database seeded successfully. ({added_count} products added, {len(INITIAL_PRODUCTS)} total available)")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
