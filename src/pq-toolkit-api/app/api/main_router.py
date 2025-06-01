from fastapi import APIRouter

from app.api.routes import experiments, status, auth, samples

api_router = APIRouter()
api_router.include_router(
    experiments.router, prefix="/experiments", tags=["experiments"]
)
api_router.include_router(status.router, prefix="/status", tags=["status"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(
    samples.router, prefix="/samples", tags=["samples"]
)
