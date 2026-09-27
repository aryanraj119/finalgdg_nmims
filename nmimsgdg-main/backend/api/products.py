from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import get_db
import models
import schemas

router = APIRouter()

@router.get("", response_model=List[schemas.ProductResponse])
def list_products(
    category: Optional[str] = None,
    second_hand_only: Optional[bool] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = Query("popular", pattern="^(popular|price_asc|price_desc|rating|new)$"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(models.Product).filter(models.Product.is_active == True)

    if category and category.lower() != "all":
        query = query.filter(models.Product.category.ilike(f"%{category}%"))

    if second_hand_only is not None:
        query = query.filter(models.Product.is_second_hand == second_hand_only)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                models.Product.name.ilike(search_term),
                models.Product.category.ilike(search_term),
                models.Product.sub_category.ilike(search_term),
                models.Product.description.ilike(search_term)
            )
        )

    if min_price is not None:
        query = query.filter(models.Product.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Product.price <= max_price)

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(models.Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(models.Product.price.desc())
    elif sort_by == "rating":
        query = query.order_by(models.Product.rating.desc())
    else:
        query = query.order_by(models.Product.created_at.desc())

    products = query.offset(offset).limit(limit).all()
    return [schemas.ProductResponse.model_validate(p) for p in products]

@router.get("/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id, models.Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product with ID '{product_id}' not found.")
    return schemas.ProductResponse.model_validate(product)
