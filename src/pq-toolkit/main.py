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


if __name__ == "__main__":
    test_setup = PqTestSetup(
        name="Test py",
        title="Example test generated from python API",
        tests=[
            PqTest(
                id=1, type=PqTestTypes.AB,
                samples=[
                    PqSample(
                        id="a", asset_path="samples/file_sample_5.mp3"
                    ),
                    PqSample(
                        id="b", asset_path="samples/file_sample_700.mp3"
                    )
                ],
                questions=[
                    PqQuestion(
                        text="Select worse quality"
                    )
                ]
            )
        ]
    )
    print(test_setup.model_dump_json(by_alias=True))
