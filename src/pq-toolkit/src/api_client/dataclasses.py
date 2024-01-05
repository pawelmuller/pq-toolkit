from enum import Enum

from pydantic import BaseModel, Field


class PqTestTypes(Enum):
    AB = "AB"
    ABX = "ABX"
    APE = "APE"
    MUSHRA = "MUSHRA"


class PqSample(BaseModel):
    sample_id: str = Field(alias="sampleId")
    asset_path: str = Field(alias="assetPath")


class PqQuestion(BaseModel):
    question_id: str = Field(alias="questionId")
    text: str


class PqTest(BaseModel):
    test_number: int = Field(alias="testNumber")
    type: PqTestTypes
    samples: list[PqSample]
    questions: list[PqQuestion]


class PqExperiment(BaseModel):
    uid: str
    name: str
    description: str
    tests: list[PqTest]
