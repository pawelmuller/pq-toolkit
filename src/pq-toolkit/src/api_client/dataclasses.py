import uuid
from enum import Enum

from pydantic import BaseModel, Field, model_validator, AliasChoices

from api_client.exceptions import PqValidationException


class PqTestTypes(Enum):
    AB = "AB"
    ABX = "ABX"
    APE = "APE"
    MUSHRA = "MUSHRA"


class PqSample(BaseModel):
    sample_id: str = Field(alias="sampleId",
                           validation_alias=AliasChoices("sampleId", "sample_id"))
    asset_path: str = Field(alias="assetPath",
                            validation_alias=AliasChoices("assetPath", "asset_path"))


class PqQuestion(BaseModel):
    question_id: str = Field(alias="questionId",
                             validation_alias=AliasChoices("questionId", "question_id"))
    text: str


class PqTestBase(BaseModel):
    test_number: int = Field(alias="testNumber",
                             validation_alias=AliasChoices("testNumber", "test_number"))
    type: PqTestTypes


class PqTestAB(PqTestBase):
    type: PqTestTypes = PqTestTypes.AB
    samples: list[PqSample]
    questions: list[PqQuestion]


class PqTestABX(PqTestBase):
    type: PqTestTypes = PqTestTypes.ABX
    samples: list[PqSample]
    xSampleId: str | None = None
    questions: list[PqQuestion] | None = None


class PqTestMUSHRA(PqTestBase):
    type: PqTestTypes = PqTestTypes.MUSHRA
    question: str | None = None
    reference: PqSample
    anchors: list[PqSample]
    samples: list[PqSample]


class PqTestAPE(PqTestBase):
    type: PqTestTypes = PqTestTypes.APE
    samples: list[PqSample]
    axis: list[PqQuestion]


class PqTestBaseResult(BaseModel):
    test_number: int = Field(alias="testNumber",
                             validation_alias=AliasChoices("testNumber", "test_number"))


class PqSelection(BaseModel):
    question_id: str = Field(alias="questionId",
                             validation_alias=AliasChoices("questionId", "question_id"))
    sample_id: str = Field(alias="sampleId",
                           validation_alias=AliasChoices("sampleId", "sample_id"))


class PqTestABResult(PqTestBaseResult):
    selections: list[PqSelection]


class PqTestABXResult(PqTestBaseResult):
    x_sample_id: str = Field(alias="xSampleId")
    x_selected: str = Field(alias="xSelected")
    selections: list[PqSelection] | list


class PqTestMUSHRAScore(BaseModel):
    sample_id: str = Field(alias="sampleId")
    score: int


class PqTestMUSHRAResult(PqTestBaseResult):
    reference_score: int = Field(alias="referenceScore")
    anchors_scores: list[PqTestMUSHRAScore] = Field(alias="anchorsScores")
    samples_scores: list[PqTestMUSHRAScore] = Field(alias="samplesScores")


class PqTestAPESampleRating(BaseModel):
    sample_id: str = Field(alias="sampleId")
    rating: int


class PqTestAPEAxisResult(BaseModel):
    axis_id: str = Field(alias="axisId")
    sample_ratings: list[PqTestAPESampleRating] = Field(alias="sampleRatings")


class PqTestAPEResult(PqTestBaseResult):
    axis_results: list[PqTestAPEAxisResult] | list = Field(alias="axisResults")


class PqTestResultsList(BaseModel):
    results: list[PqTestABResult | PqTestABXResult | PqTestAPEResult | PqTestMUSHRAResult]


class PqExperiment(BaseModel):
    uid: str | None = uuid.uuid4()
    name: str
    description: str
    tests: list[PqTestAB | PqTestABX | PqTestAPE | PqTestMUSHRA]
