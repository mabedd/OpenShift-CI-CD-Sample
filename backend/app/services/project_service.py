from sqlalchemy.orm import Session

from app.repositories.project_repository import ProjectRepository
from app.schemas.project_schema import ProjectCreate


class ProjectService:

    def __init__(self, db: Session):
        self.project_repository = ProjectRepository(db)

    def get_all(self):
        return self.project_repository.get_all()

    def create(self, dto: ProjectCreate):
        return self.project_repository.create(
            name=dto.name,
            description=dto.description
        )