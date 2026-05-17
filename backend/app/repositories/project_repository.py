from sqlalchemy.orm import Session

from app.db.models.project import Project


class ProjectRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(Project).all()

    def create(self, name: str, description: str | None):
        project = Project(
            name=name,
            description=description
        )

        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)

        return project