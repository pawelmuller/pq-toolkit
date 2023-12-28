from enum import Enum

from pydantic import BaseModel, Field


class PqTestTypes(Enum):
    AB = "AB"
    MUSHRA = "MUSHRA"


class PqSample(BaseModel):
    id: str
    asset_path: str = Field(serialization_alias="assetPath")


class PqQuestion(BaseModel):
    text: str


class PqTest(BaseModel):
    id: int
    type: PqTestTypes
    samples: list[PqSample]
    questions: list[PqQuestion]


class PqTestSetup(BaseModel):
    name: str
    title: str
    tests: list[PqTest]