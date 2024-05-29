from sqlalchemy.exc import NoResultFound, IntegrityError

from app.models import Experiment, Test, ExperimentTestResult, Admin
from app.schemas import *
from typing import Any
from sqlmodel import Session, select
from fastapi import UploadFile
from fastapi.responses import StreamingResponse
from app.core.sample_manager import SampleManager
from app.utils import PqException
from pydantic import ValidationError


class ExperimentNotFound(PqException):
    def __init__(self, experiment_name: str) -> None:
        super().__init__(f"Experiment {experiment_name} not found!", error_code=404)


class ExperimentAlreadyExists(PqException):
    def __init__(self, experiment_name: str) -> None:
        super().__init__(f"Experiment {experiment_name} already exists!", error_code=409)


class ExperimentNotConfigured(PqException):
    def __init__(self, experiment_name: str) -> None:
        super().__init__(f"Experiment {experiment_name} not configured!", error_code=404)


class ExperimentAlreadyConfigured(PqException):
    def __init__(self, experiment_name: str) -> None:
        super().__init__(f"Experiment {experiment_name} already configured!")


class NoTestsFoundForExperiment(PqException):
    def __init__(self, experiment_name: str) -> None:
        super().__init__(f"Experiment {experiment_name} has not tests!", error_code=404)


class NoResultsData(PqException):
    def __init__(self) -> None:
        super().__init__(f"No results data provided!", error_code=404)


class NoMatchingTest(PqException):
    def __init__(self, test_number: str) -> None:
        super().__init__(f"No matching test found for test number {test_number}!")


class IncorectInputData(PqException):
    def __init__(self, test_number: str) -> None:
        super().__init__(f"Incorect data in test result {test_number}!")


def transform_test(test: Test) -> dict:
    test_dict = {"test_number": test.number, "type": test.type}
    if test.test_setup:
        test_dict.update(test.test_setup)
    return test_dict


def transform_experiment(experiment: Experiment) -> PqExperiment:
    tests = [transform_test(test) for test in experiment.tests]
    return PqExperiment.model_validate({"name": experiment.full_name, "description": experiment.description, "endText": experiment.end_text, "tests": tests})


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
    # Possibly refactor to use cascade delete built into db
    for test in result.tests:
        for test_result in test.experiment_test_results:
            session.delete(test_result)
        session.delete(test)
    session.delete(result)
    session.commit()


def add_experiment(session: Session, experiment_name: str):
    session.add(Experiment(name=experiment_name))
    try:
        session.commit()
    except IntegrityError:
        raise ExperimentAlreadyExists(experiment_name)


def transform_test_upload(test: PqTestBase, experiment_id: int) -> Test:
    test_dict = test.model_dump()
    test_dict.pop("test_number")
    test_dict.pop("type")
    return Test(number=test.test_number, type=test.type, test_setup=test_dict)


def upload_experiment_config(session: Session, experiment_name: str, json_file: UploadFile):
    experiment_upload = PqExperiment.model_validate_json(json_file.file.read())
    statement = select(Experiment).where(Experiment.name == experiment_name)
    try:
        experiment_db = session.exec(statement).one()
    except NoResultFound:
        raise ExperimentNotFound(experiment_name)
    for test in experiment_db.tests:
        for test_result in test.experiment_test_results:
            session.delete(test_result)
        session.delete(test)
    experiment_db.full_name = experiment_upload.name
    experiment_db.description = experiment_upload.description
    experiment_db.end_text = experiment_upload.end_text
    tests = [transform_test_upload(test, experiment_db.id) for test in experiment_upload.tests]
    experiment_db.tests = tests
    experiment_db.configured = True
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


def add_experiment_result(session: Session, experiment_name: str, experiment_result_raw_json: dict):
    experiment_query = select(Experiment).where(Experiment.name == experiment_name)
    try:
        experiment = session.exec(experiment_query).one()
    except NoResultFound:
        raise ExperimentNotFound(experiment_name)

    if len(experiment.tests) == 0:
        raise NoTestsFoundForExperiment(experiment_name)
    test_mapping = [(test.number, test.id, test.type) for test in experiment.tests]

    results = add_test_results(session, experiment_result_raw_json, test_mapping)
    return get_experiment_tests_results(session, experiment_name, results)


def add_test_results(session: Session, results_data: dict[str, Any], test_mapping: list[tuple[int, int, str]]) -> str:
    results_list = results_data.get('results')
    if not results_list:
        raise NoResultsData

    test_number_to_info = {number: (test_id, test_type) for number, test_id, test_type in test_mapping}
    placeholder = str(uuid.uuid4())  # Generate a unique UUID

    for result_dict in results_list:
        test_number = result_dict.get('testNumber')
        test_info = test_number_to_info.get(test_number)

        if test_info is None:
            raise NoMatchingTest(test_number)

        test_id, test_type = test_info
        test_type = test_type.value
        try:
            if test_type == "AB":
                PqTestABResult(**result_dict)
            elif test_type == "ABX":
                PqTestABXResult(**result_dict)
            elif test_type == "MUSHRA":
                PqTestMUSHRAResult(**result_dict)
            elif test_type == "APE":
                PqTestAPEResult(**result_dict)
            else:
                raise ValueError(f"Unknown test type: {test_type}")

            new_result = ExperimentTestResult(
                test_id=test_id,
                test_result=result_dict,
                experiment_use=placeholder
            )

            session.add(new_result)
        except ValidationError:
            raise IncorectInputData(test_number)
        session.add(new_result)
    session.commit()

    return placeholder


def get_experiment_tests_results(session: Session, experiment_name, result_name=None) -> PqTestResultsList:
    experiment_query = select(Experiment).where(Experiment.name == experiment_name)
    try:
        experiment = session.exec(experiment_query).one()
    except NoResultFound:
        raise ExperimentNotFound(experiment_name)
    return get_test_results_by_ids(session, [test.id for test in experiment.tests], result_name)


def get_test_results_by_ids(session: Session, test_ids: list[int], result_name=None) -> PqTestResultsList:
    if not result_name:
        results_query = select(ExperimentTestResult).where(ExperimentTestResult.test_id.in_(test_ids))
    else:
        results_query = select(ExperimentTestResult).where(ExperimentTestResult.test_id.in_(test_ids) & ExperimentTestResult.experiment_use.__eq__(result_name))
    try:
        db_results = session.exec(results_query).all()
    except NoResultFound:
        raise ExperimentNotFound(results_query)

    test_results = []

    for db_result in db_results:
        test_type = str(db_result.test.type.value)
        test_result_data = db_result.test_result

        if test_type == "AB":
            result_model = PqTestABResult(**test_result_data)
        elif test_type == "ABX":
            result_model = PqTestABXResult(**test_result_data)
        elif test_type == "MUSHRA":
            result_model = PqTestMUSHRAResult(**test_result_data)
        elif test_type == "APE":
            result_model = PqTestAPEResult(**test_result_data)
        else:
            continue

        test_results.append(result_model)

    return PqTestResultsList(results=test_results)


def authenticate(session: Session, username: str, hashed_password: str) -> Admin | None:
    statement = select(Admin).where(Admin.username == username)
    try:
        user = session.exec(statement).one()
    except NoResultFound:
        return None
    return user if user.hashed_password == hashed_password else None