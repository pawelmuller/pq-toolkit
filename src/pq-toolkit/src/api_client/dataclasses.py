import uuid
from enum import Enum

from pydantic import BaseModel, Field, model_validator

from api_client.exceptions import PqValidationException


class PqTestTypes(Enum):
    AB = "AB"
    ABX = "ABX"
    APE = "APE"
    MUSHRA = "MUSHRA"


class PqSelection(BaseModel):
    question_id: str = Field(alias="questionId")
    sample_id: str = Field(alias="sampleId")


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
    questions: list[PqQuestion] | None = None
    axis: list[PqQuestion] | None = None
    reference: PqSample | None = None
    anchors: list[PqSample] | None = None

    @model_validator(mode='after')
    def _check_reference_and_anchor_coexistence(self) -> 'PqTest':
        if self.reference is None and self.anchors is None:
            return self
        if self.reference is not None and self.anchors is not None:
            return self
        else:
            raise PqValidationException(details="Fields 'anchor' and 'reference' are required together")


class PqTestResult(BaseModel):
    test_number: int = Field(alias="testNumber")
    selections: list[PqSelection]


class PqExperiment(BaseModel):
    uid: str | None = uuid.uuid4()
    name: str
    description: str
    tests: list[PqTest]
