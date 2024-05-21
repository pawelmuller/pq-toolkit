from sqlalchemy import Column, JSON
from sqlmodel import SQLModel, Field, Relationship

from app.schemas import PqTestTypes


class Admin(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    is_active: bool = True


class Sample(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    file_path: str


class Experiment(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    full_name: str | None = Field(default=None)
    description: str | None = Field(default=None)
    end_text: str | None
    configured: bool = False

    tests: list["Test"] = Relationship(back_populates="experiment")


class Test(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    number: int
    type: PqTestTypes
    test_setup: dict = Field(sa_column=Column(JSON))
    experiment_id: int = Field(foreign_key="experiment.id")

    experiment: list["Experiment"] = Relationship(back_populates="tests")
    experiment_test_results: list["ExperimentTestResult"] = Relationship(back_populates="test")


class ExperimentTestResult(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    test_result: dict = Field(sa_column=Column(JSON))
    test_id: int = Field(foreign_key="test.id")
    experiment_use: str

    test: list["Test"] = Relationship(back_populates="experiment_test_results")
