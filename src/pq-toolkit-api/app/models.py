import uuid
from uuid import UUID

from sqlalchemy import Column, JSON
from sqlmodel import SQLModel, Field, Relationship

from app.schemas import PqTestTypes


class Admin(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str | None = Field(default=None, index=True, unique=True)
    hashed_password: str | None
    is_active: bool = True


class Sample(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    file_path: str
    ratings: list["Rating"] = Relationship(back_populates="sample")

    class Config:
        arbitrary_types_allowed = True



class Experiment(SQLModel, table=True):
    id: UUID | None = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True, unique=True)
    full_name: str | None = Field(default=None)
    description: str | None = Field(default=None)
    end_text: str | None
    configured: bool = False

    tests: list["Test"] = Relationship(back_populates="experiment")


class Test(SQLModel, table=True):
    id: int | None = Field(default_factory=None, primary_key=True)
    number: int
    type: PqTestTypes
    test_setup: dict = Field(sa_column=Column(JSON))
    experiment_id: UUID = Field(foreign_key="experiment.id")

    experiment: Experiment = Relationship(back_populates="tests")
    experiment_test_results: list["ExperimentTestResult"] = Relationship(
        back_populates="test"
    )


class ExperimentTestResult(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    test_result: dict = Field(sa_column=Column(JSON))
    test_id: int = Field(foreign_key="test.id")
    experiment_use: str

    test: Test = Relationship(back_populates="experiment_test_results")


class Rating(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    sample_id: int = Field(foreign_key="sample.id")
    rating: float
    sample: Sample = Relationship(back_populates="ratings")

    class Config:
        arbitrary_types_allowed = True
