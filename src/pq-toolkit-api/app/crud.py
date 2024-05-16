from typing import Any

from app.models import Experiment
from app.schemas import *
from sqlmodel import Session, select
from io import BytesIO

from fastapi import UploadFile
from fastapi.responses import StreamingResponse
from app.core.sample_manager import SampleManager
from app.core.config import settings
from app.utils import sample_stream


def get_experiments(session: Session) -> PqExperimentsList:
    return PqExperimentsList(experiments=["test"])


def get_experiment_by_name(session: Session, experiment_name: str) -> PqExperiment:
    statement = select(Experiment).where(Experiment.name == experiment_name)
    result = session.exec(statement).one()
    return PqExperiment.model_validate(result)


def remove_experiment_by_name(session: Session, experiment_name: str):
    statement = select(Experiment).where(Experiment.name == experiment_name)
    result = session.exec(statement).one()
    session.delete(result)
    session.commit()


def add_experiment(session: Session, experiment_name: str):
    session.add(Experiment(name=experiment_name))
    session.commit()


def upload_experiment_config(session: Session, experiment_name: str, json_file: UploadFile):
    statement = select(Experiment).where(Experiment.name == experiment_name)
    result = session.exec(statement).one()
    json_data = json_file.file.read()
    result.description = json_data["description"]

    session.commit()


def get_experiment_sample(manager: SampleManager, experiment_name: str, sample_name: str) -> StreamingResponse:
    with manager.get_sample(experiment_name, sample_name) as sample:
        return StreamingResponse(sample_stream(sample), media_type="audio/mpeg")


def upload_experiment_sample(manager: SampleManager, experiment_name: str, audio_file: UploadFile):
    sample_name = audio_file.filename
    sample_data = audio_file.file
    manager.upload_sample(experiment_name, sample_name, sample_data)


def delete_experiment_sample(manager: SampleManager, experiment_name: str, sample_name: str):
    manager.remove_sample(experiment_name, sample_name)


def get_experiment_samples(manager: SampleManager, experiment_name: str) -> list[str]:
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
