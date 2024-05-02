from sqlmodel import SQLModel, Field, Relationship


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
    name: str = Field(index=True)
    description: str
    end_text: str

    tests = Relationship(back_populates="experiment")


class Test(SQLModel):
    id: int | None = Field(default=None, primary_key=True)
    number: int
    # test_setup = Column(JSONB, index=True)
    experiment_id: int = Field(foreign_key="experiment.id")

    experiment: list["Experiment"] = Relationship(back_populates="tests")
    experiment_test_results: list["ExperimentTestResult"] = Relationship(back_populates="test")


class ExperimentTestResult(SQLModel):
    id: int | None = Field(default=None, primary_key=True)
    # test_result = Column(JSONB, index=True)
    test_id: int = Field(foreign_key="test.id")

    test: list["Test"] = Relationship(back_populates="experiment_test_results")
