from sqlmodel import Session, create_engine

from app import crud
from app.core.config import settings
# from app.models import TODO


engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI), echo=(settings.ENVIRONMENT == "local"))


def init_db(session: Session) -> None:
    pass
