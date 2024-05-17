from typing import Generator, Annotated

from fastapi import Depends
from sqlmodel import Session

from app.core.db import engine
from app.core.sample_manager import SampleManager
from app.core.config import settings


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

def get_sample_manager() -> Generator[SampleManager, None, None]:
    session = SampleManager.from_settings(settings)
    yield session

SessionDep = Annotated[Session, Depends(get_db)]
SampleManagerDep = Annotated[SampleManager, Depends(get_sample_manager)]