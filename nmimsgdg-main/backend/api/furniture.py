from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_furniture():
    return {
        "items": [
            {
                "id": "chair-001",
                "name": "Minimalist Birch Desk Chair",
                "category": "Chairs",
                "price": 1800,
                "condition": "Excellent",
                "width": 0.5,
                "depth": 0.5,
                "height": 0.85
            }
        ]
    }
