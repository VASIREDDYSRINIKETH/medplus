"""
Medicine API routes.
Handles CRUD, sell logic, search, and low-stock alerting.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional

from app.database import get_db
from app.models import Medicine
from app.email_utils import send_low_stock_email

router = APIRouter()


# ──────────────────────────────────────────────
# Pydantic schemas
# ──────────────────────────────────────────────

class MedicineCreate(BaseModel):
    name: str = Field(..., max_length=100)
    salt: str = Field(..., max_length=100)
    stock: int = Field(..., ge=0)
    reorder_level: int = Field(..., ge=0)
    expiry_date: date
    supplier_email: str = Field(..., max_length=150)


class MedicineResponse(BaseModel):
    id: int
    name: str
    salt: str
    stock: int
    reorder_level: int
    expiry_date: date
    supplier_email: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SellRequest(BaseModel):
    quantity: int = Field(..., gt=0, description="Quantity to sell (must be > 0)")


# ──────────────────────────────────────────────
# GET /medicines — Return all medicines
# ──────────────────────────────────────────────

@router.get("/medicines", response_model=list[MedicineResponse])
def get_all_medicines(db: Session = Depends(get_db)):
    """Fetch all medicines from the inventory."""
    medicines = db.query(Medicine).order_by(Medicine.id).all()
    return medicines


# ──────────────────────────────────────────────
# POST /medicines — Add a new medicine
# ──────────────────────────────────────────────

@router.post("/medicines", response_model=MedicineResponse, status_code=201)
def add_medicine(medicine: MedicineCreate, db: Session = Depends(get_db)):
    """Add a new medicine to the inventory."""
    new_medicine = Medicine(
        name=medicine.name,
        salt=medicine.salt,
        stock=medicine.stock,
        reorder_level=medicine.reorder_level,
        expiry_date=medicine.expiry_date,
        supplier_email=medicine.supplier_email,
    )
    db.add(new_medicine)
    db.commit()
    db.refresh(new_medicine)
    return new_medicine


# ──────────────────────────────────────────────
# PUT /sell/{id} — Sell medicine (reduce stock)
# ──────────────────────────────────────────────

@router.put("/sell/{id}", response_model=MedicineResponse)
def sell_medicine(id: int, sell: SellRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Sell a medicine by reducing its stock.

    Flow:
      1. Fetch medicine by id (404 if not found)
      2. If stock < quantity → 400 error
      3. stock = stock - quantity
      4. If stock < reorder_level → trigger low-stock alert
      5. Save and return updated medicine
    """
    # Step 1: Fetch medicine
    medicine = db.query(Medicine).filter(Medicine.id == id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail=f"Medicine with id {id} not found")

    # Step 2: Validate sufficient stock
    if medicine.stock < sell.quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient stock. Available: {medicine.stock}, Requested: {sell.quantity}",
        )

    # Step 3: Reduce stock
    medicine.stock -= sell.quantity

    # Step 4: Check reorder level and trigger alert
    if medicine.stock < medicine.reorder_level:
        reorder_amount = medicine.reorder_level * 2
        print("=" * 60)
        print(f"[ALERT] LOW STOCK ALERT")
        print(f"   Medicine : {medicine.name} (Salt: {medicine.salt})")
        print(f"   Stock    : {medicine.stock}")
        print(f"   Reorder  : {medicine.reorder_level}")
        print(f"   Supplier : {medicine.supplier_email}")
        print(f"   Message  : Low stock for {medicine.name}. Send {reorder_amount} more.")
        print(f"   -> Dispatching low stock alert via SMTP to supplier ({medicine.supplier_email})...")
        print("=" * 60)
        
        # Dispatch background email
        background_tasks.add_task(
            send_low_stock_email, 
            supplier_email=medicine.supplier_email,
            medicine_name=medicine.name,
            reorder_amount=reorder_amount
        )

    # Step 5: Save and return
    db.commit()
    db.refresh(medicine)
    return medicine


# ──────────────────────────────────────────────
# GET /search?q= — Search by name or salt
# ──────────────────────────────────────────────

@router.get("/search", response_model=list[MedicineResponse])
def search_medicines(q: str = Query(..., min_length=1, description="Search query"), db: Session = Depends(get_db)):
    """Search medicines by name or salt (case-insensitive partial match)."""
    results = (
        db.query(Medicine)
        .filter(or_(Medicine.name.ilike(f"%{q}%"), Medicine.salt.ilike(f"%{q}%")))
        .order_by(Medicine.id)
        .all()
    )
    return results
