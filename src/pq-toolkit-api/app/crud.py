from sqlalchemy.exc import NoResultFound, IntegrityError

from app.models import Experiment, Test
from app.schemas import *
from sqlmodel import Session, select

from fastapi import UploadFile
from fastapi.responses import StreamingResponse
from app.core.sample_manager import SampleManager
from app.utils import PqException


class ExperimentNotFound(PqException):
    def __init__(self, experiment_name: str) -> None:
        super().__init__(f"Experiment {experiment_name} not found!")


class ExperimentAlreadyExists(PqException):
    def __init__(self, experiment_name: str) -> None:
        super().__init__(f"Experiment {experiment_name} already exists!")


class ExperimentNotConfigured(PqException):
    def __init__(self, experiment_name: str) -> None:
        super().__init__(f"Experiment {experiment_name} not configured!")


def transform_test(test: Test) -> dict:
    test_dict = {"test_number": test.number, "type": test.type}
    test_dict.update(test.test_setup)
    return test_dict


def transform_experiment(experiment: Experiment) -> PqExperiment:
    tests = [transform_test(test) for test in experiment.tests]
    return PqExperiment.model_validate({"name": experiment.full_name, "description": experiment.description, "tests": tests})


def get_experiments(session: Session) -> PqExperimentsList:
    experiments = session.exec(select(Experiment)).all()
    return PqExperimentsList(experiments=[exp.name for exp in experiments])


def get_experiment_by_name(session: Session, experiment_name: str) -> PqExperiment:
    statement = select(Experiment).where(Experiment.name == experiment_name)
    try:
        result = session.exec(statement).one()
    except NoResultFound:
        raise ExperimentNotFound(experiment_name)
    if not result.configured:
        raise ExperimentNotConfigured(experiment_name)
    return transform_experiment(result)


def remove_experiment_by_name(session: Session, experiment_name: str):
    statement = select(Experiment).where(Experiment.name == experiment_name)
    try:
        result = session.exec(statement).one()
    except NoResultFound:
        raise ExperimentNotFound(experiment_name)
    session.delete(result)
    session.commit()


def add_experiment(session: Session, experiment_name: str):
    session.add(Experiment(name=experiment_name))
    try:
        session.commit()
    except IntegrityError:
        raise ExperimentAlreadyExists(experiment_name)


def transform_test_upload(test: PqTestBase):
    test_dict = test.model_dump()
    test_dict.pop("test_number")
    test_dict.pop("type")
    return Test(number=test.test_number, type=test.type, test_setup=test_dict)


def upload_experiment_config(session: Session, experiment_name: str, json_file: UploadFile):
    json_data = json_file.file.read()
    experiment_upload = PqExperiment.model_validate(json_data)
    statement = select(Experiment).where(Experiment.name == experiment_name)
    experiment_db = session.exec(statement).one()
    experiment_db.full_name = experiment_upload.name
    experiment_db.description = experiment_upload.description
    experiment_db.end_text = experiment_upload.end_text
    tests = [transform_test_upload(test) for test in experiment_upload.tests]
    experiment_db.tests = tests
    session.commit()


def get_experiment_sample(manager: SampleManager, experiment_name: str, sample_name: str) -> StreamingResponse:
    sample_generator = manager.get_sample(experiment_name, sample_name)
    return StreamingResponse(sample_generator, media_type="audio/mpeg")


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
