from sqlalchemy.orm import Session

from app.db.models.task import Task


class TaskRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(Task).all()

    def create(
        self,
        title: str,
        description: str | None,
        status: str,
        project_id: int
    ):
        task = Task(
            title=title,
            description=description,
            status=status,
            project_id=project_id
        )

        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)

        return task