from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.auth_schema import LoginRequest
from app.schemas.user_schema import UserCreate
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(
    dto: UserCreate,
    db: Session = Depends(get_db)
):
    service = AuthService(db)

    return service.register(dto)


@router.post("/login")
def login(
    dto: LoginRequest,
    db: Session = Depends(get_db)
):
    service = AuthService(db)

    return service.login(dto.email, dto.password)