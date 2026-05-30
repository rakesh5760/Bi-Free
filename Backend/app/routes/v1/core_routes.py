from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import schemas
from app.auth.deps import get_db, get_current_user
from app.models.core import Level, Domain
from app.schemas.core import Level as LevelSchema, Domain as DomainSchema
from app.utils.responses import success_response, StandardResponse

router = APIRouter()

@router.get("/levels", response_model=StandardResponse[List[LevelSchema]])
def get_levels(
    current_user: Any = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Get all available levels."""
    levels = db.query(Level).order_by(Level.name).all()
    return success_response(data=levels, message="Levels retrieved successfully.")


@router.get("/domains", response_model=StandardResponse[List[DomainSchema]])
def get_domains(
    db: Session = Depends(get_db)
) -> Any:
    """Get all available domains."""
    domains = db.query(Domain).order_by(Domain.name).all()
    return success_response(data=domains, message="Domains retrieved successfully.")
