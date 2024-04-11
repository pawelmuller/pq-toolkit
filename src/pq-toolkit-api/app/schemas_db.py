from pydantic import BaseModel
from typing import List, Optional

# Schema for Admin model
class AdminBase(BaseModel):
    email: str
    is_active: Optional[bool] = True

class AdminCreate(AdminBase):
    hashed_password: str

class Admin(AdminBase):
    id: int

    class Config:
        orm_mode = True

# Schema for Sample model
class SampleBase(BaseModel):
    title: str
    file_path: str

class SampleCreate(SampleBase):
    pass

class Sample(SampleBase):
    id: int

    class Config:
        orm_mode = True

# Schema for Experiment model
class ExperimentBase(BaseModel):
    name: str
    description: str
    end_text: str

class ExperimentCreate(ExperimentBase):
    pass

class Experiment(ExperimentBase):
    id: int
    tests: List['Test'] = []

    class Config:
        orm_mode = True

# Schema for Test model
class TestBase(BaseModel):
    number: int
    test_setup: dict

class TestCreate(TestBase):
    experiment_id: int

class Test(TestBase):
    id: int
    experiment_id: int
    experiment_test_results: List['ExperimentTestResult'] = []

    class Config:
        orm_mode = True

# Schema for ExperimentTestResult model
class ExperimentTestResultBase(BaseModel):
    test_result: dict

class ExperimentTestResultCreate(ExperimentTestResultBase):
    test_id: int

class ExperimentTestResult(ExperimentTestResultBase):
    id: int
    test_id: int

    class Config:
        orm_mode = True
