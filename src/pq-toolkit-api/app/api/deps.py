from typing import Generator, Annotated

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from pydantic import ValidationError
from sqlalchemy.exc import NoResultFound
from sqlmodel import Session, select

from app.core.db import engine
from app.core.sample_manager import SampleManager
from app.core.config import settings
from app.core.security import ALGORITHM
from app.models import Admin
from app.schemas import TokenPayload

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"/api{settings.API_V1_STR}/auth/login")


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def get_sample_manager() -> Generator[SampleManager, None, None]:
    session = SampleManager.from_settings(settings)
    yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]


def get_current_admin(session: SessionDep, token: TokenDep) -> Admin:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    try:
        admin = session.exec(select(Admin).where(Admin.id == token_data.user_id)).one()
    except NoResultFound:
        raise HTTPException(status_code=404, detail="Admin not found")
    if not admin.is_active:
        raise HTTPException(status_code=400, detail="Inactive admin")
    return admin


SampleManagerDep = Annotated[SampleManager, Depends(get_sample_manager)]
CurrentAdmin = Annotated[Admin, Depends(get_current_admin)]
