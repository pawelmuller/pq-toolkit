import inspect
import uuid
from enum import Enum

from pydantic import BaseModel, Field, AliasChoices, ConfigDict, field_validator, UUID4


class PqTestTypes(Enum):
    """
    Class representing types of tests handled by PQToolkit.
    """

    AB: str = "AB"
    ABX: str = "ABX"
    APE: str = "APE"
    MUSHRA: str = "MUSHRA"


class PqSample(BaseModel):
    """
    Class representing sound sample.

    Attributes:
        sample_id: An ID of the sample.
        asset_path: Path to the sample.
    """

    sample_id: str = Field(
        alias="sampleId", validation_alias=AliasChoices("sampleId", "sample_id")
    )
    asset_path: str = Field(
        alias="assetPath", validation_alias=AliasChoices("assetPath", "asset_path")
    )


class PqQuestion(BaseModel):
    """
    Class representing test question.

    Attributes:
        question_id: An ID of the question.
        text: Text of the question.
    """

    question_id: str = Field(
        alias="questionId", validation_alias=AliasChoices("questionId", "question_id")
    )
    text: str


class PqTestBase(BaseModel):
    """
    Base class for the test.

    Attributes:
        test_number: A number of the test.
        type: A type of the test.
    """

    model_config = ConfigDict(use_enum_values=True, validate_default=True)

    test_number: int = Field(
        alias="testNumber", validation_alias=AliasChoices("testNumber", "test_number")
    )
    type: PqTestTypes


class PqTestAB(PqTestBase):
    """
    Base class for the AB test.

    Attributes:
        test_number: A number of the test.
        type: A type of the test.
        samples: list of samples associated with the test
        questions: list of questions for the test
    """

    samples: list[PqSample]
    questions: list[PqQuestion]
    type: PqTestTypes = PqTestTypes.AB


class PqTestABX(PqTestBase):
    """
    Base class for the ABX test.

    Attributes:
        test_number: A number of the test.
        type: A type of the test.
        x_sample_id: Unknown sample id - the one to identify
        samples: list of samples associated with the test
        questions: list of questions for the test
    """

    x_sample_id: str | None = Field(
        None,
        alias="xSampleId",
        validation_alias=AliasChoices("xSampleId", "x_sample_id"),
    )
    samples: list[PqSample]
    questions: list[PqQuestion] | None = None
    type: PqTestTypes = PqTestTypes.ABX


class PqTestMUSHRA(PqTestBase):
    """
    Base class for the MUSHRA test.

    Attributes:
        test_number: A number of the test.
        type: A type of the test.
        reference: A reference sample
        question: A question for the test
        anchors: list of anchor samples associated with the test
        samples: list of samples associated with the test
    """

    reference: PqSample
    question: str | None = None
    anchors: list[PqSample]
    samples: list[PqSample]
    type: PqTestTypes = PqTestTypes.MUSHRA


class PqTestAPE(PqTestBase):
    """
    Base class for the APE test.

    Attributes:
        test_number: A number of the test.
        type: A type of the test.
        axis: A list of axis questions
        samples: list of samples associated with the test
    """

    axis: list[PqQuestion]
    samples: list[PqSample]
    type: PqTestTypes = PqTestTypes.APE


class PqTestBaseResult(BaseModel):
    test_number: int = Field(
        alias="testNumber", validation_alias=AliasChoices("testNumber", "test_number")
    )
    feedback: str | None = None

class PqSelection(BaseModel):
    question_id: str = Field(
        alias="questionId", validation_alias=AliasChoices("questionId", "question_id")
    )
    sample_id: str = Field(
        alias="sampleId", validation_alias=AliasChoices("sampleId", "sample_id")
    )


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
    results: list[
        PqTestABResult | PqTestABXResult | PqTestMUSHRAResult | PqTestAPEResult
    ]


class PqExperiment(BaseModel):
    """
    Class representing experiments.

    Attributes:
        uid: A unique ID of the experiment.
        name: Experiment name.
        description: Experiment description.
        tests: A list of test objects
    """

    uid: UUID4 | str = uuid.uuid4()
    name: str
    description: str
    tests: list[PqTestMUSHRA | PqTestAPE | PqTestABX | PqTestAB]

    @field_validator("tests", mode="before")  # noqa
    @classmethod
    def validate_tests(
        cls, v: list
    ) -> list[PqTestMUSHRA | PqTestAPE | PqTestABX | PqTestAB]:
        tests_list = []
        for test in v:
            object_type = type(test)
            if inspect.isclass(object_type) and issubclass(object_type, PqTestBase):
                tests_list.append(test)
            else:
                match PqTestTypes(test.get("type")):
                    case PqTestTypes.AB:
                        tests_list.append(PqTestAB(**test))
                    case PqTestTypes.ABX:
                        tests_list.append(PqTestABX(**test))
                    case PqTestTypes.APE:
                        tests_list.append(PqTestAPE(**test))
                    case PqTestTypes.MUSHRA:
                        tests_list.append(PqTestMUSHRA(**test))
        return tests_list


