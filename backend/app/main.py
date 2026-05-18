import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError

from app.api.routes.auth import router as auth_router
from app.api.routes.projects import router as projects_router
from app.api.routes.tasks import router as tasks_router
from app.core.config import settings
from app.db.session import Base, engine


MAX_RETRIES = 10
RETRY_DELAY = 5

for attempt in range(MAX_RETRIES):
    try:
        Base.metadata.create_all(bind=engine)
        print("Database connected successfully")
        break

    except OperationalError as e:
        print(f"Database not ready yet ({attempt + 1}/{MAX_RETRIES})")
        print(e)

        time.sleep(RETRY_DELAY)

else:
    raise Exception("Could not connect to database")


app = FastAPI(title="TaskFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(tasks_router)


@app.get("/")
def health():
    return {
        "status": "running"
    }