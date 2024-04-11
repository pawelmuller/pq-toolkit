from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
# from app.models import TODO

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


def init_db(session: Session) -> None:
    pass  # TODO: Default values to insert into the DB
