from typing import Any

from fastapi import APIRouter, UploadFile, HTTPException
from app.schemas import *
import app.crud

router = APIRouter()


@router.get("/", response_model=PqApiStatus)
def get_status():
    return PqApiStatus()
