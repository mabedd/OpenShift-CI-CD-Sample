from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password
)
from app.repositories.user_repository import UserRepository
from app.schemas.user_schema import UserCreate


class AuthService:

    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)

    def register(self, dto: UserCreate):

        existing_user = self.user_repository.get_by_email(dto.email)

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="User already exists"
            )

        hashed_password = hash_password(dto.password)

        return self.user_repository.create(
            email=dto.email,
            hashed_password=hashed_password
        )

    def login(self, email: str, password: str):

        user = self.user_repository.get_by_email(email)

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        if not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        token = create_access_token({
            "sub": user.email
        })

        return {
            "access_token": token,
            "token_type": "bearer"
        }