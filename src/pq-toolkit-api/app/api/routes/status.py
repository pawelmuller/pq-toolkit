from fastapi import APIRouter
from app.schemas import PqApiStatus

router = APIRouter()


@router.get("/", response_model=PqApiStatus)
def get_status():
    return PqApiStatus()
