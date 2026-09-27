import sqlite3
import json

DB_PATHS = [
    "c:/Users/ANANYA SINGH/ikeaaa/nmimsgdg-main/backend/ikea_store.db",
    "c:/Users/ANANYA SINGH/ikeaaa/ikea_store.db"
]

ALL_MARKETPLACE_PRODUCTS = [
    {
        "id": "obj-001-couch",
        "name": "Scandinavian 3-Seater Couch (.OBJ)",
        "category": "Sofas",
        "sub_category": "Couches",
        "type": "3-Seater Sofa",
        "price": 16800.0,
        "original_price": 45000.0,
        "condition": "Like New",
        "description": "Preloaded high-fidelity 3D OBJ Scandinavian 3-seater couch asset.",
        "dimensions": "2.2m × 0.9m × 0.85m",
        "material": "Premium Weave & High-Density Foam",
        "stock_quantity": 8,
        "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
        "location": "Koramangala, Bengaluru",
        "seller_name": "SecondHand Studio"
    },
    {
        "id": "obj-002-bed",
        "name": "Full-Size Bed with White Linen (.OBJ)",
        "category": "Beds",
        "sub_category": "Double Beds",
        "type": "Bed Frame",
        "price": 8999.0,
        "original_price": 24000.0,
        "condition": "Like New",
        "description": "Preloaded 3D OBJ full-size bed asset with detailed headboard and white sheets.",
        "dimensions": "1.6m × 2.0m × 0.9m",
        "material": "Solid Wood & Cotton Linen",
        "stock_quantity": 5,
        "image_url": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
        "location": "Indiranagar, Bengaluru",
        "seller_name": "Urban Home Reclaim"
    },
    {
        "id": "obj-003-wardrobe",
        "name": "Modern 4-Door Storage Wardrobe (.OBJ)",
        "category": "Storage",
        "sub_category": "Wardrobes",
        "type": "Wardrobe Cabinet",
        "price": 11500.0,
        "original_price": 29000.0,
        "condition": "Excellent",
        "description": "Preloaded 3D OBJ 4-door wardrobe storage cabinet asset.",
        "dimensions": "1.8m × 0.6m × 2.1m",
        "material": "Matte Birch & Aluminum Handles",
        "stock_quantity": 4,
        "image_url": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
        "location": "HSR Layout, Bengaluru",
        "seller_name": "Metro Furniture Outlet"
    },
    {
        "id": "obj-004-table",
        "name": "Minimalist Wooden Center Table (.OBJ)",
        "category": "Tables",
        "sub_category": "Coffee Tables",
        "type": "Center Table",
        "price": 2499.0,
        "original_price": 6500.0,
        "condition": "Excellent",
        "description": "Preloaded 3D OBJ center coffee table asset with natural wood grain finish.",
        "dimensions": "1.1m × 0.7m × 0.45m",
        "material": "Solid Oak",
        "stock_quantity": 12,
        "image_url": "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
        "location": "Whitefield, Bengaluru",
        "seller_name": "EcoReclaim Workshop"
    },
    {
        "id": "obj-005-chair",
        "name": "Ergonomic Lounge / Desk Chair (.OBJ)",
        "category": "Chairs",
        "sub_category": "Lounge Chairs",
        "type": "Ergonomic Chair",
        "price": 3200.0,
        "original_price": 8500.0,
        "condition": "Like New",
        "description": "Preloaded 3D OBJ ergonomic lounge desk chair asset.",
        "dimensions": "0.7m × 0.7m × 0.95m",
        "material": "Molded Steel & Polymer",
        "stock_quantity": 15,
        "image_url": "https://images.unsplash.com/photo-1580481077198-98e3c4a86ce9?auto=format&fit=crop&w=800&q=80",
        "location": "Koramangala, Bengaluru",
        "seller_name": "TechHub Surplus"
    },
    {
        "id": "obj-006-desk",
        "name": "Modern Workstation Study Desk (.OBJ)",
        "category": "Desks",
        "sub_category": "Study Desks",
        "type": "Workstation",
        "price": 4200.0,
        "original_price": 10500.0,
        "condition": "Excellent",
        "description": "Preloaded 3D OBJ modern workstation desk asset.",
        "dimensions": "1.4m × 0.7m × 0.75m",
        "material": "Steel Frame & Walnut Top",
        "stock_quantity": 9,
        "image_url": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
        "location": "Bandra, Mumbai",
        "seller_name": "Aarav Sharma"
    },
    {
        "id": "chair-001",
        "name": "Minimalist Birch Desk Chair",
        "category": "Chairs",
        "sub_category": "Desk Chairs",
        "type": "Plywood Chair",
        "price": 1800.0,
        "original_price": 4200.0,
        "condition": "Excellent",
        "description": "Ergonomic molded plywood birch chair with clean steel frame legs.",
        "dimensions": "0.5m × 0.5m × 0.85m",
        "material": "Birch Wood & Steel",
        "stock_quantity": 14,
        "image_url": "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
        "location": "Koramangala, Bengaluru",
        "seller_name": "Aarav Sharma"
    },
    {
        "id": "chair-002",
        "name": "Nordic Soft Linen Armchair",
        "category": "Chairs",
        "sub_category": "Armchairs",
        "type": "Linen Armchair",
        "price": 4500.0,
        "original_price": 11000.0,
        "condition": "Like New",
        "description": "Plush oatmeal linen upholstered armchair with tapered solid oak legs.",
        "dimensions": "0.8m × 0.75m × 0.9m",
        "material": "Linen & Solid Oak",
        "stock_quantity": 6,
        "image_url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
        "location": "Indiranagar, Bengaluru",
        "seller_name": "Priya Nair"
    },
    {
        "id": "chair-003",
        "name": "Ergonomic Mesh Executive Chair",
        "category": "Chairs",
        "sub_category": "Office Chairs",
        "type": "Executive Mesh",
        "price": 3200.0,
        "original_price": 8500.0,
        "condition": "Good",
        "description": "High-back mesh office chair with adjustable lumbar support.",
        "dimensions": "0.65m × 0.65m × 1.15m",
        "material": "Breathable Mesh & Aluminum",
        "stock_quantity": 18,
        "image_url": "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80",
        "location": "HSR Layout, Bengaluru",
        "seller_name": "TechHub Surplus"
    },
    {
        "id": "table-001",
        "name": "Solid Oak Dining Table",
        "category": "Tables",
        "sub_category": "Dining Tables",
        "type": "6-Seater Table",
        "price": 6800.0,
        "original_price": 16500.0,
        "condition": "Excellent",
        "description": "Heavy solid oak dining table with beveled edges and clear lacquer finish.",
        "dimensions": "1.8m × 0.9m × 0.75m",
        "material": "Solid Oak",
        "stock_quantity": 7,
        "image_url": "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80",
        "location": "Jayanagar, Bengaluru",
        "seller_name": "Nordic Living Reclaim"
    },
    {
        "id": "table-002",
        "name": "Round Glass Coffee Table",
        "category": "Tables",
        "sub_category": "Coffee Tables",
        "type": "Glass Table",
        "price": 1900.0,
        "original_price": 4800.0,
        "condition": "Good",
        "description": "Tempered glass round top with interlocking birch base legs.",
        "dimensions": "0.85m × 0.85m × 0.42m",
        "material": "Tempered Glass & Birch",
        "stock_quantity": 11,
        "image_url": "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80",
        "location": "Whitefield, Bengaluru",
        "seller_name": "Kavita Rao"
    },
    {
        "id": "sofa-001",
        "name": "2-Seater Fabric Loveseat",
        "category": "Sofas",
        "sub_category": "Loveseats",
        "type": "2-Seater",
        "price": 8500.0,
        "original_price": 22000.0,
        "condition": "Like New",
        "description": "Compact 2-seater loveseat in charcoal grey textured weave.",
        "dimensions": "1.5m × 0.85m × 0.8m",
        "material": "Textured Fabric & Pine",
        "stock_quantity": 4,
        "image_url": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
        "location": "Indiranagar, Bengaluru",
        "seller_name": "Siddharth Jain"
    },
    {
        "id": "bed-001",
        "name": "King Size Upholstered Bed Frame",
        "category": "Beds",
        "sub_category": "King Beds",
        "type": "Upholstered Bed",
        "price": 14200.0,
        "original_price": 38000.0,
        "condition": "Like New",
        "description": "Platform bed frame with cushioned linen headboard.",
        "dimensions": "2.0m × 1.8m × 1.1m",
        "material": "Linen & Engineered Wood",
        "stock_quantity": 3,
        "image_url": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
        "location": "Bandra, Mumbai",
        "seller_name": "Meera Kapoor"
    },
    {
        "id": "storage-001",
        "name": "5-Shelf Tall Bookcase",
        "category": "Storage",
        "sub_category": "Bookcases",
        "type": "Shelving Unit",
        "price": 2800.0,
        "original_price": 6900.0,
        "condition": "Excellent",
        "description": "Slim vertical shelving unit with adjustable shelf heights.",
        "dimensions": "0.8m × 0.3m × 1.9m",
        "material": "MDF & Wood Foil",
        "stock_quantity": 16,
        "image_url": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
        "location": "Koramangala, Bengaluru",
        "seller_name": "Aarav Sharma"
    },
    {
        "id": "lighting-001",
        "name": "Nordic Arched Floor Lamp",
        "category": "Lighting",
        "sub_category": "Floor Lamps",
        "type": "Floor Lamp",
        "price": 1650.0,
        "original_price": 4200.0,
        "condition": "Like New",
        "description": "Overhanging brass arch lamp with heavy marble base.",
        "dimensions": "0.4m × 1.2m × 1.8m",
        "material": "Brass & Marble",
        "stock_quantity": 20,
        "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
        "location": "Indiranagar, Bengaluru",
        "seller_name": "Urban Home Reclaim"
    },
    {
        "id": "ikea-baggebo-01",
        "name": "BAGGEBO Shelving Unit",
        "category": "Storage",
        "sub_category": "Shelving units",
        "type": "Metal Shelving",
        "price": 1990.0,
        "original_price": 1990.0,
        "condition": "Brand New",
        "description": "Shelving unit, metal/white, 60x25x116 cm (23 5/8x9 7/8x45 5/8 \").",
        "dimensions": "60x25x116 cm",
        "material": "Steel, Epoxy/polyester powder coating",
        "stock_quantity": 50,
        "image_url": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
        "location": "IKEA Hub, Navi Mumbai",
        "seller_name": "IKEA Official Store"
    },
    {
        "id": "ikea-brimnes-02",
        "name": "BRIMNES 3-Door Wardrobe",
        "category": "Storage",
        "sub_category": "Wardrobes",
        "type": "Wardrobe with mirror",
        "price": 16990.0,
        "original_price": 19990.0,
        "condition": "Brand New",
        "description": "Wardrobe with 3 doors, white, 117x50x190 cm (46x19 3/4x74 3/4 \").",
        "dimensions": "117x50x190 cm",
        "material": "Particleboard, Paper foil, Plastic edging, Mirror glass",
        "stock_quantity": 25,
        "image_url": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
        "location": "IKEA Hub, Navi Mumbai",
        "seller_name": "IKEA Official Store"
    }
]

for db_path in DB_PATHS:
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check columns
        cursor.execute("PRAGMA table_info(products)")
        cols = [c[1] for c in cursor.fetchall()]
        print(f"Columns in {db_path}: {cols}")
        
        for p in ALL_MARKETPLACE_PRODUCTS:
            cursor.execute("SELECT id FROM products WHERE id = ?", (p["id"],))
            row = cursor.fetchone()
            if row:
                cursor.execute("""
                    UPDATE products 
                    SET name = ?, category = ?, sub_category = ?, type = ?, price = ?, original_price = ?,
                        condition = ?, description = ?, dimensions = ?, material = ?, stock_quantity = ?,
                        image_url = ?, is_active = 1
                    WHERE id = ?
                """, (
                    p["name"], p["category"], p["sub_category"], p["type"], p["price"], p["original_price"],
                    p["condition"], p["description"], p["dimensions"], p["material"], p["stock_quantity"],
                    p["image_url"], p["id"]
                ))
            else:
                cursor.execute("""
                    INSERT INTO products (
                        id, name, category, sub_category, type, price, original_price,
                        condition, description, dimensions, material, stock_quantity,
                        stock_status, image_url, is_active, is_second_hand, is_ikea_family
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'In Stock', ?, 1, 1, 0)
                """, (
                    p["id"], p["name"], p["category"], p["sub_category"], p["type"], p["price"], p["original_price"],
                    p["condition"], p["description"], p["dimensions"], p["material"], p["stock_quantity"],
                    p["image_url"]
                ))
        
        conn.commit()
        cursor.execute("SELECT COUNT(*) FROM products")
        total = cursor.fetchone()[0]
        print(f"Total products in {db_path}: {total}")
        conn.close()
    except Exception as e:
        print(f"Error on {db_path}: {e}")
