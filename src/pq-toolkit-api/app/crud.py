from typing import Any
from app.schemas import *

from fastapi import UploadFile


def get_experiments() -> PqExperimentsList:
    return PqExperimentsList(experiments=["test"])


def get_experiment_by_name(experiment_name: str) -> PqExperiment:
    return PqExperiment(
        name=experiment_name,
        description="Some test suite",
        tests=[
            PqTestAB(
                    test_number=1,
                    samples=[
                        PqSample(sample_id="s1",
                                 asset_path="file_sample_5.mp3"),
                        PqSample(sample_id="s2",
                                 asset_path="file_sample_700.mp3")
                    ],
                questions=[
                        PqQuestion(question_id="q1",
                                   text="Select better quality"),
                        PqQuestion(question_id="q2", text="Select more warmth")
                ]
            ),
            PqTestABX(
                test_number=2,
                samples=[
                    PqSample(sample_id="s1",
                             asset_path="file_sample_5.mp3"),
                    PqSample(sample_id="s2",
                             asset_path="file_sample_700.mp3")
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
                             asset_path="file_sample_5.mp3"),
                    PqSample(sample_id="s2",
                             asset_path="file_sample_700.mp3"),
                    PqSample(sample_id="s3", asset_path="sample-12s.mp3")
                ],
                axis=[
                    PqQuestion(question_id="a1", text="Quality"),
                    PqQuestion(question_id="a2", text="Depth")
                ]
            ),
            PqTestMUSHRA(
                test_number=4,
                reference=PqSample(
                    sample_id="ref", asset_path="file_sample_5.mp3"),
                anchors=[
                    PqSample(sample_id="a1",
                             asset_path="file_sample_700.mp3"),
                    PqSample(sample_id="a2",
                             asset_path="file_sample_5.mp3")
                ],
                samples=[
                    PqSample(sample_id="s1", asset_path="sample-12s.mp3"),
                    PqSample(sample_id="s2", asset_path="sample-15s.mp3"),
                    PqSample(sample_id="s3", asset_path="sample-12s.mp3"),
                    PqSample(sample_id="s4", asset_path="sample-15s.mp3"),
                    PqSample(sample_id="s5", asset_path="sample-12s.mp3"),
                    PqSample(sample_id="s6", asset_path="sample-15s.mp3")
                ]
            )
        ]
    )


def remove_experiment_by_name(experiment_name: str):
    pass


def add_experiment(experiment_name: str):
    pass


def upload_experiment_config(experiment_name: str, json_file: UploadFile):
    pass


def upload_experiment_sample(experiment_name: str, audio_file: UploadFile):
    pass


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
