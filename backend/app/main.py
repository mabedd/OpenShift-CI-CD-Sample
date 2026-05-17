from fastapi import FastAPI

from app.api.routes.auth import router as auth_router
from app.api.routes.projects import router as projects_router
from app.api.routes.tasks import router as tasks_router

from app.db.models.project import Project
from app.db.models.task import Task
from app.db.models.user import User
from app.db.session import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TaskFlow API")

app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(tasks_router)


@app.get("/")
def health():
    return {
        "status": "running"
    }