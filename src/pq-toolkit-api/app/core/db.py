from sqlalchemy.exc import NoResultFound
from sqlmodel import Session, create_engine, SQLModel, select

from app.core.config import settings
from app.models import Admin


engine = create_engine(
    str(settings.SQLALCHEMY_DATABASE_URI), echo=(settings.ENVIRONMENT == "local")
)


def init_db(session: Session) -> None:
    if settings.ENVIRONMENT == "local":
        SQLModel.metadata.create_all(engine)
    # Create initial data
    try:
        session.exec(
            select(Admin).where(Admin.username == settings.FIRST_SUPERUSER_NAME)
        ).one()
    except NoResultFound:
        admin = Admin(
            username=settings.FIRST_SUPERUSER_NAME,
            hashed_password=settings.FIRST_SUPERUSER_PASSWORD,
        )
        session.add(admin)
        session.commit()
