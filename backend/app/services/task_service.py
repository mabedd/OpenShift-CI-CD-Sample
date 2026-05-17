from sqlalchemy.orm import Session

from app.repositories.task_repository import TaskRepository
from app.schemas.task_schema import TaskCreate


class TaskService:

    def __init__(self, db: Session):
        self.task_repository = TaskRepository(db)

    def get_all(self):
        return self.task_repository.get_all()

    def create(self, dto: TaskCreate):
        return self.task_repository.create(
            title=dto.title,
            description=dto.description,
            status=dto.status,
            project_id=dto.project_id
        )