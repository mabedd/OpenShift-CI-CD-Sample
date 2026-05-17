from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.project_schema import ProjectCreate
from app.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("")
def get_projects(
    db: Session = Depends(get_db)
):
    service = ProjectService(db)

    return service.get_all()


@router.post("")
def create_project(
    dto: ProjectCreate,
    db: Session = Depends(get_db)
):
    service = ProjectService(db)

    return service.create(dto)