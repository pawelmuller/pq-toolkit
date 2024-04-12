from typing import Any
from app.schemas import *
from sqlalchemy.orm import Session
from io import BytesIO

from fastapi import UploadFile
from app.core.sample_manager import SampleManager
from app.core.config import settings


def get_experiments() -> PqExperimentsList:
    return PqExperimentsList(experiments=["test"])


def get_experiment_by_name(experiment_name: str) -> PqExperiment:
    ex = PqExperiment(
        name=experiment_name,
        description="Some test suite",
        tests=[
            PqTestAB(
                    test_number=1,
                    samples=[
                        PqSample(sample_id="s1",
                                 asset_path="test.wav"),
                        PqSample(sample_id="s2",
                                 asset_path="test.wav")
                    ],
                questions=[
                        PqQuestion(question_id="q1",
                                   text="Select better quality"),
                        PqQuestion(question_id="q2", text="Select more warmth")
                ]
            ),
            PqTestABX(
                test_number=2,
                xSampleId="s1",
                samples=[
                    PqSample(sample_id="s1",
                             asset_path="test.wav"),
                    PqSample(sample_id="s2",
                             asset_path="test.wav")
                ],
                questions=[
                    PqQuestion(question_id="q1",
                               text="Select better quality"),
                    PqQuestion(question_id="q2", text="Select more warmth")
                ]
            ),
            PqTestAPE(
                test_number=3,
                samples=[
                    PqSample(sample_id="s1",
                             asset_path="test.wav"),
                    PqSample(sample_id="s2",
                             asset_path="test.wav"),
                    PqSample(sample_id="s3", asset_path="test.wav")
                ],
                axis=[
                    PqQuestion(question_id="a1", text="Quality"),
                    PqQuestion(question_id="a2", text="Depth")
                ]
            ),
            PqTestMUSHRA(
                test_number=4,
                reference=PqSample(
                    sample_id="ref", asset_path="test.wav"),
                question="What is your favouriose color",
                anchors=[
                    PqSample(sample_id="a1",
                             asset_path="test.wav"),
                    PqSample(sample_id="a2",
                             asset_path="test.wav")
                ],
                samples=[
                    PqSample(sample_id="s1", asset_path="test.wav"),
                    PqSample(sample_id="s2", asset_path="test.wav"),
                    PqSample(sample_id="s3", asset_path="test.wav"),
                    PqSample(sample_id="s4", asset_path="test.wav"),
                    PqSample(sample_id="s5", asset_path="test.wav"),
                    PqSample(sample_id="s6", asset_path="test.wav")
                ]
            )
        ]
    )
    PqExperiment.model_validate(ex)
    return ex


def remove_experiment_by_name(experiment_name: str):
    pass


def add_experiment(experiment_name: str):
    pass


def upload_experiment_config(experiment_name: str, json_file: UploadFile):
    pass


def get_experiment_sample(experiment_name: str, sample_name: str) -> UploadFile:
    manager = SampleManager.from_settings(settings)
    bytes = manager.get_sample(experiment_name, sample_name)
    return UploadFile(BytesIO(bytes), size=len(bytes), filename=sample_name)


def upload_experiment_sample(experiment_name: str, audio_file: UploadFile):
    manager = SampleManager.from_settings(settings)
    sample_name = audio_file.filename
    sample_data = audio_file.file
    manager.upload_sample(experiment_name, sample_name, sample_data)


def delete_experiment_sample(experiment_name: str, sample_name: str):
    manager = SampleManager.from_settings(settings)
    manager.remove_sample(experiment_name, sample_name)


def get_experiment_samples(experiment_name: str) -> list[str]:
    manager = SampleManager.from_settings(settings)
    return manager.list_matching_samples(experiment_name)


def get_experiments_results(experiment_name: str) -> PqResultsList:
    return PqResultsList(results=["test"])


def get_experiment_tests_results(experiment_name, result_name) -> PqTestResultsList:
    return PqTestResultsList(results=[
        PqTestABResult(
            testNumber=10,
            selections=[
                PqSelection(
                    questionId="20",
                    sampleId="sample"
                )
            ]
        )
    ])


def add_experiment_result(experiment_name: str, experiment_result_raw_json: dict):
    pass
