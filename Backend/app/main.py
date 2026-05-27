from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.routes.v1 import auth, users, students, learning, exams, faculty, mentors, clients, projects, reputation, analytics, core_routes
from app.utils.exceptions import validation_exception_handler, http_exception_handler, global_exception_handler
from app.database.session import Base, engine, safe_migrate

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

@app.on_event("startup")
def on_startup():
    # Create any new tables and apply safe additive column migrations
    Base.metadata.create_all(bind=engine)
    safe_migrate()


# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify explicit domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(students.router, prefix=f"{settings.API_V1_STR}/students", tags=["students"])
app.include_router(learning.router, prefix=f"{settings.API_V1_STR}/learning", tags=["learning"])
app.include_router(exams.router, prefix=f"{settings.API_V1_STR}/exams", tags=["exams"])
app.include_router(faculty.router, prefix=f"{settings.API_V1_STR}/faculty", tags=["faculty"])
app.include_router(mentors.router, prefix=f"{settings.API_V1_STR}/mentors", tags=["mentors"])
app.include_router(clients.router, prefix=f"{settings.API_V1_STR}/clients", tags=["clients"])
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["projects"])
app.include_router(reputation.router, prefix=f"{settings.API_V1_STR}/reputation", tags=["reputation"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["analytics"])
app.include_router(core_routes.router, prefix=f"{settings.API_V1_STR}/core", tags=["core"])

@app.get("/")
def root():
    from app.utils.responses import success_response
    return success_response(message="Welcome to the Bi-Free Freelancing Platform API")
