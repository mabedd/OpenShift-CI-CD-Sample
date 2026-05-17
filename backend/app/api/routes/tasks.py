from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.task_schema import TaskCreate
from app.services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("")
def get_tasks(
    db: Session = Depends(get_db)
):
    service = TaskService(db)

    return service.get_all()


@router.post("")
def create_task(
    dto: TaskCreate,
    db: Session = Depends(get_db)
):
    service = TaskService(db)

    return service.create(dto)