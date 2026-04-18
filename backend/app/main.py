"""
FastAPI application entry point.
- Creates tables on startup
- Seeds 5 sample medicines
- Enables CORS for React frontend
"""

from contextlib import asynccontextmanager
from datetime import date

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, SessionLocal, Base
from app.models import Medicine
from app.routes.medicines import router as medicine_router


# ──────────────────────────────────────────────
# Seed data — 5 sample medicines
# ──────────────────────────────────────────────

SAMPLE_MEDICINES = [
    {
        "name": "Dolo 650",
        "salt": "Paracetamol",
        "stock": 120,
        "reorder_level": 30,
        "expiry_date": date(2026, 12, 15),
        "supplier_email": "sriniketh.2003.14@gmail.com",
    },
    {
        "name": "Azithral 500",
        "salt": "Azithromycin",
        "stock": 45,
        "reorder_level": 20,
        "expiry_date": date(2026, 8, 20),
        "supplier_email": "atul.yadav22b@iiitg.ac.in",
    },
    {
        "name": "Pan D",
        "salt": "Pantoprazole + Domperidone",
        "stock": 80,
        "reorder_level": 25,
        "expiry_date": date(2026, 6, 10),
        "supplier_email": "vikash.kumar22b@iiitg.ac.in",
    },
    {
        "name": "Crocin Advance",
        "salt": "Paracetamol",
        "stock": 200,
        "reorder_level": 50,
        "expiry_date": date(2027, 3, 1),
        "supplier_email": "atuljobs26@gmail.com",
    },
    {
        "name": "Amoxyclav 625",
        "salt": "Amoxicillin + Clavulanic Acid",
        "stock": 15,
        "reorder_level": 20,
        "expiry_date": date(2026, 5, 5),
        "supplier_email": "orewapain0010@gmail.com",
    },
]


def seed_database():
    """Insert sample medicines if the table is empty."""
    db = SessionLocal()
    try:
        count = db.query(Medicine).count()
        if count == 0:
            for med in SAMPLE_MEDICINES:
                db.add(Medicine(**med))
            db.commit()
            print(f"[OK] Seeded {len(SAMPLE_MEDICINES)} sample medicines.")
        else:
            print(f"[INFO] Database already has {count} medicines. Skipping seed.")
    finally:
        db.close()


# ──────────────────────────────────────────────
# Application lifespan (startup/shutdown)
# ──────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables & seed
    Base.metadata.create_all(bind=engine)
    print("[OK] Database tables created.")
    seed_database()
    yield
    # Shutdown: nothing to clean up
    print("[BYE] Application shutting down.")


# ──────────────────────────────────────────────
# FastAPI app instance
# ──────────────────────────────────────────────

app = FastAPI(
    title="MedPlus — Smart Pharmacy Inventory Management",
    description="Backend API for managing pharmacy inventory, sales, and low-stock alerts.",
    version="1.0.0",
    lifespan=lifespan,
)


# ──────────────────────────────────────────────
# CORS — allow React frontend
# ──────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Register routes
# ──────────────────────────────────────────────

app.include_router(medicine_router, tags=["Medicines"])


@app.get("/", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "MedPlus Pharmacy API", "version": "1.0.0"}
