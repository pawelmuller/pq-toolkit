from sqlmodel import Session, create_engine, SQLModel

from app import crud
from app.core.config import settings
from app.models import Admin, Sample, Experiment, Test, ExperimentTestResult


engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI), echo=(settings.ENVIRONMENT == "local"))


def init_db(session: Session) -> None:
    if settings.ENVIRONMENT == "local":
        SQLModel.metadata.create_all(engine)
    # Create initial data
