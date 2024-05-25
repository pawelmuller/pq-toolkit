from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import SessionDep, CurrentAdmin
from app.core.security import create_access_token
from app.crud import authenticate
from app.models import Admin
from app.schemas import AccessToken

router = APIRouter()


@router.post("/login")
def login(session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> AccessToken:
    user = authenticate(session=session, username=form_data.username, hashed_password=form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return AccessToken(access_token=create_access_token(user.id))


@router.get("/user")
def get_user(admin: CurrentAdmin) -> Admin:
    return Admin(id=admin.id, email=admin.email, is_active=admin.is_active, username=admin.username)


