import uuid

from sqlalchemy.exc import NoResultFound, IntegrityError

from app.models import Experiment, Test, ExperimentTestResult, Admin, Sample, Rating
from sqlmodel import Session, select
from fastapi import UploadFile
from fastapi.responses import StreamingResponse
from app.core.sample_manager import SampleManager
from app.schemas import (
    PqTestABResult,
    PqTestABXResult,
    PqTestMUSHRAResult,
    PqTestAPEResult,
    PqExperiment,
    PqExperimentsList,
    PqTestBase,
    PqTestTypes,
    PqTestResultsList,
    PqSampleRatingList,
    PqSampleRating
)
from app.utils import PqException
from pydantic import ValidationError
from sqlalchemy.orm import subqueryload
from sqlalchemy.sql import func
from fpdf import FPDF


class ExperimentNotFound(PqException):
    def __init__(self, experiment_name: str) -> None:
        super().__init__(f"Experiment {experiment_name} not found!", error_code=404)


class ExperimentAlreadyExists(PqException):
    def __init__(self, experiment_name: str) -> None:
        super().__init__(
            f"Experiment {experiment_name} already exists!", error_code=409
        )


class ExperimentNotConfigured(PqException):
    def __init__(self, experiment_name: str) -> None:
        super().__init__(
            f"Experiment {experiment_name} not configured!", error_code=404
        )


class ExperimentAlreadyConfigured(PqException):
    def __init__(self, experiment_name: str) -> None:
        super().__init__(f"Experiment {experiment_name} already configured!")


class NoTestsFoundForExperiment(PqException):
    def __init__(self, experiment_name: str) -> None:
        super().__init__(f"Experiment {experiment_name} has not tests!", error_code=404)


class NoResultsData(PqException):
    def __init__(self) -> None:
        super().__init__("No results data provided!", error_code=404)


class NoMatchingTest(PqException):
    def __init__(self, test_number: str) -> None:
        super().__init__(f"No matching test found for test number {test_number}!")


class IncorrectInputData(PqException):
    def __init__(self, test_number: str) -> None:
        super().__init__(f"Incorect data in test result {test_number}!")


def transform_test(test: Test) -> dict:
    test_dict = {"test_number": test.number, "type": test.type}
    if test.test_setup:
        test_dict.update(test.test_setup)
    return test_dict


def transform_experiment(experiment: Experiment) -> PqExperiment:
    tests = [transform_test(test) for test in experiment.tests]
    return PqExperiment.model_validate(
        {
            "name": experiment.full_name,
            "description": experiment.description,
            "endText": experiment.end_text,
            "tests": tests,
            "uid": experiment.id
        }
    )


def get_experiments(session: Session) -> PqExperimentsList:
    experiments = session.exec(select(Experiment)).all()
    return PqExperimentsList(experiments=[exp.name for exp in experiments])


def get_db_experiment_by_name(session: Session, experiment_name: str) -> Experiment:
    statement = select(Experiment).where(Experiment.name == experiment_name)
    try:
        result = session.exec(statement).one()
    except NoResultFound:
        raise ExperimentNotFound(experiment_name)
    return result


def get_experiment_by_name(session: Session, experiment_name: str) -> PqExperiment:
    result = get_db_experiment_by_name(session, experiment_name)
    if not result.configured:
        raise ExperimentNotConfigured(experiment_name)
    return transform_experiment(result)


def remove_experiment_by_name(session: Session, experiment_name: str):
    result = get_db_experiment_by_name(session, experiment_name)
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


def transform_test_upload(test: PqTestBase) -> Test:
    test_dict = test.model_dump()
    test_dict.pop("test_number")
    test_dict.pop("type")
    return Test(number=test.test_number, type=test.type, test_setup=test_dict)


def upload_experiment_config(
        session: Session, experiment_name: str, json_file: UploadFile
):
    experiment_upload = PqExperiment.model_validate_json(json_file.file.read())
    experiment_db = get_db_experiment_by_name(session, experiment_name)
    for test in experiment_db.tests:
        for test_result in test.experiment_test_results:
            session.delete(test_result)
        session.delete(test)
    session.commit()
    experiment_db.full_name = experiment_upload.name
    experiment_db.description = experiment_upload.description
    experiment_db.end_text = experiment_upload.end_text
    tests = [
        transform_test_upload(test)
        for test in experiment_upload.tests
    ]
    experiment_db.tests = tests
    experiment_db.configured = True
    session.commit()


def get_experiment_sample(
        manager: SampleManager, experiment_name: str, sample_name: str
) -> StreamingResponse:
    sample_generator = manager.get_sample(experiment_name, sample_name)
    return StreamingResponse(sample_generator, media_type="audio/mpeg")


def upload_experiment_sample(
        manager: SampleManager, experiment_name: str, audio_file: UploadFile
):
    sample_name = audio_file.filename
    sample_data = audio_file.file
    return manager.upload_sample(experiment_name, sample_name, sample_data)


def delete_experiment_sample(
        manager: SampleManager, experiment_name: str, sample_name: str
):
    manager.remove_sample(experiment_name, sample_name)


def get_experiment_samples(manager: SampleManager, experiment_name: str) -> list[str]:
    return manager.list_matching_samples(experiment_name)


def add_experiment_result(session: Session, experiment_name: str, result_list: dict):
    experiment = get_db_experiment_by_name(session, experiment_name)
    if len(experiment.tests) == 0:
        raise NoTestsFoundForExperiment(experiment_name)
    result_name = add_test_results(session, result_list, experiment)
    return get_experiment_tests_results(session, experiment_name, result_name)


def add_test_results(session: Session, results_data: dict, experiment: Experiment) -> str:
    results = results_data.get("results")
    if results is None:
        raise NoResultsData()

    test_info_mapper = {test.number: (test.id, test.type) for test in experiment.tests}
    placeholder = str(uuid.uuid4())  # Generate a unique UUID

    for result in results:
        test_info = test_info_mapper.get(result.get("testNumber"))
        if test_info is None:
            raise NoMatchingTest(str(result.get("testNumber")))
        verify_test_result(result, test_info[1])

        new_result = ExperimentTestResult(
            test_id=test_info[0], test_result=result, experiment_use=placeholder
        )
        session.add(new_result)
    session.commit()

    return placeholder


def transform_test_result(
        result: ExperimentTestResult, test_type: PqTestTypes
) -> PqTestABResult | PqTestABXResult | PqTestMUSHRAResult | PqTestAPEResult:
    data = result.test_result.copy()
    data["experimentUse"] = result.experiment_use
    data["type"] = test_type.value

    if test_type == PqTestTypes.AB:
        return PqTestABResult(**data)
    elif test_type == PqTestTypes.ABX:
        return PqTestABXResult(**data)
    elif test_type == PqTestTypes.MUSHRA:
        return PqTestMUSHRAResult(**data)
    elif test_type == PqTestTypes.APE:
        return PqTestAPEResult(**data)


def verify_test_result(result: dict, test_type: PqTestTypes):
    try:
        if test_type == PqTestTypes.AB:
            PqTestABResult.model_validate(result)
        elif test_type == PqTestTypes.ABX:
            PqTestABXResult.model_validate(result)
        elif test_type == PqTestTypes.MUSHRA:
            PqTestMUSHRAResult.model_validate(result)
        elif test_type == PqTestTypes.APE:
            PqTestAPEResult.model_validate(result)
    except ValidationError as e:
        raise IncorrectInputData(str(e))


def get_experiment_tests_results(
        session: Session, experiment_name, result_name=None
) -> PqTestResultsList:
    experiment = get_db_experiment_by_name(session, experiment_name)
    results = []
    for test in experiment.tests:
        for result in test.experiment_test_results:
            if result_name is None or result.experiment_use == result_name:
                results.append(transform_test_result(result, test.type))
    return PqTestResultsList(results=results)


def modify_experiment_tests_results_for_chart(
    session: Session, experiment_name: str
) -> PqTestResultsList:
    original_results = get_experiment_tests_results(session, experiment_name)

    modified_results = [
        result.copy(update={"type": test_type})
        for result, test_type in zip(
            original_results.results,
            [test.type for test in get_db_experiment_by_name(session, experiment_name).tests],
        )
    ]

    return PqTestResultsList(results=modified_results)



def authenticate(session: Session, username: str, hashed_password: str) -> Admin | None:
    statement = select(Admin).where(Admin.username == username)
    try:
        user = session.exec(statement).one()
    except NoResultFound:
        return None
    return user if user.hashed_password == hashed_password else None


def add_sample_rating(session: Session, sample: PqSampleRating):
    sample_id = sample.sample_id
    sample_name = sample.name
    sample_rating = sample.rating

    sample_record = session.exec(select(Sample).where(Sample.id == int(sample_id))).first()
    if not sample_record:
        raise ValueError(f"Sample '{sample_name}' not found")

    new_rating = Rating(
        sample_id=sample_record.id,
        rating=sample_rating,
    )
    session.add(new_rating)


    session.commit()

    return PqSampleRating(
        sampleId=str(sample_record.id),
        name=sample_record.title,
        assetPath=sample_record.file_path,
        rating=sample_rating
    )


def upload_sample(
        session: Session, manager: SampleManager, audio_file: UploadFile
):
    sample_name = audio_file.filename
    sample_data = audio_file.file
    upload_name = manager.upload_sample_directly(sample_name, sample_data)
    new_sample = Sample(
        title=sample_name,
        file_path=upload_name,
    )
    session.add(new_sample)
    session.commit()


def get_samples(session: Session):
    samples = session.exec(
        select(Sample).options(subqueryload(Sample.ratings))
    ).all()

    return PqSampleRatingList(samples=[
        PqSampleRating(
            sample_id=str(sample.id),
            name=sample.title,
            asset_path=sample.file_path,
            rating=session.exec(
                select(func.avg(Rating.rating)).where(Rating.sample_id == sample.id)
            ).one_or_none() or 0
        )
        for sample in samples
    ])


def get_sample(
        manager: SampleManager, sample_name: str
) -> StreamingResponse:
    sample_generator = manager.get_sample_directly(sample_name)
    return StreamingResponse(sample_generator, media_type="audio/mpeg")

def assign_sample_to_experiment(session: Session, manager: SampleManager, experiment_name: str, sample_id: int):
    sample = session.query(Sample).filter(Sample.id == sample_id).first()
    if not sample:
        raise ValueError(f"Sample with id '{sample_id}' not found")
    manager.copy_sample(sample.file_path,experiment_name, sample.file_path.split("/")[-1])
    return sample.file_path.split("/")[-1]

def create_sample(session: Session, file_path: str, title: str) -> Sample:
    if not title:
        title = file_path
    new_sample = Sample(
        title=title,
        file_path=file_path
    )
    session.add(new_sample)
    session.commit()
    session.refresh(new_sample)
    return new_sample.file_path.split("/")[-1]


def delete_sample(
        manager: SampleManager, session: Session, sample_id: str
):
    sample = session.query(Sample).filter(Sample.id == int(sample_id)).first()

    if not sample:
        raise ValueError(f"Sample with id {sample_id} not found")

    session.query(Rating).filter(Rating.sample_id == sample.id).delete()

    manager.remove_sample_directly(sample.file_path)

    session.delete(sample)
    session.commit()


def prepare_csv_result(session: Session, result_dict: dict):

    match result_dict["test_type"]:
        case "AB":
            assert all(isinstance(result, PqTestABResult) for result in result_dict["results"]), \
                "Not all results are instances of PqTestABResult"

            print(result_dict["results"])
            all_questions = sorted({
                selection.question_id
                for result in result_dict["results"]
                for selection in result.selections
            })

            headers = ["Test type"] + [f"question {i + 1},sample {i + 1}" for i in range(len(all_questions))] + ["Feedback"]
            csv_content = ",".join(headers) + "\n"

            for result in result_dict["results"]:
                row = [result_dict["test_type"]]
                question_to_sample = {sel.question_id: sel.sample_id for sel in result.selections}

                for question in all_questions:
                    sample = question_to_sample.get(question, "Null")
                    row.extend([question, sample])

                row.append(getattr(result, "feedback", "") or "")
                csv_content += ",".join(row) + "\n"

            return csv_content

        case "ABX":
            assert all(isinstance(result, PqTestABXResult) for result in result_dict["results"]), \
                "Not all results are instances of PqTestABXResult"
            print(result_dict["results"])
            all_questions = sorted({
                selection.question_id
                for result in result_dict["results"]
                for selection in result.selections
            })

            headers = ["Test type", "xSample", "xSelected"] + [
                f"question {i + 1},sample {i + 1}" for i in range(len(all_questions))
            ] + ["Feedback"]
            csv_content = ",".join(headers) + "\n"

            for result in result_dict["results"]:
                row = [result_dict["test_type"], result.x_sample_id, result.x_selected]
                question_to_sample = {sel.question_id: sel.sample_id for sel in result.selections}

                for question in all_questions:
                    sample = question_to_sample.get(question, "Null")
                    row.extend([question, sample])

                row.append(getattr(result, "feedback", "") or "")
                csv_content += ",".join(row) + "\n"

            return csv_content

        case "MUSHRA":
            assert all(isinstance(result, PqTestMUSHRAResult) for result in result_dict["results"]), \
                "Not all results are instances of PqTestMUSHRAResult"

            all_anchors = sorted({
                anchor.sample_id
                for result in result_dict["results"]
                for anchor in result.anchors_scores
            })
            all_samples = sorted({
                sample.sample_id
                for result in result_dict["results"]
                for sample in result.samples_scores
            })

            headers = (["Test type", "ReferenceFile", "ReferenceScore"]
                       + [f"Anchor Sample {i+1},Anchor Score {i+1}"for i in range(len(all_anchors))]
                       + [f"Sample {i+1},Sample Score {i+1}" for i in range(len(all_samples))]
                       + ["Feedback"])
            csv_content = ",".join(headers) + "\n"
            for result in result_dict["results"]:
                row = [result_dict["test_type"], result_dict["reference_file"], result.reference_score]
                for anchor in result.anchors_scores:
                    row.extend([anchor.sample_id, anchor.score])
                for sample in result.samples_scores:
                    row.extend([sample.sample_id, sample.score])
                row.append(getattr(result, "feedback", "") or "")
                csv_content += ",".join(map(str, row)) + "\n"

            return csv_content

        case "APE":
            assert all(isinstance(result, PqTestAPEResult) for result in result_dict["results"]), \
            "Not all results are instances of PqTestAPEResult"

            all_samples = sorted({
                sample.sample_id
                for result in result_dict["results"]
                for axis in result.axis_results
                for sample in axis.sample_ratings
            })
            headers = ["Test type", "Axis"] + [f"Sample {i+1},Sample Score {i+1}" for i in range(len(all_samples))] + ["Feedback"]
            csv_content = ",".join(headers) + "\n"
            for result in result_dict["results"]:
                for axis in result.axis_results:
                    row = [result_dict["test_type"], axis.axis_id]
                    for sample in axis.sample_ratings:
                        row.extend([sample.sample_id, sample.rating])
                    row.append(getattr(result, "feedback", "") or "")
                    csv_content += ",".join(map(str, row)) + "\n"
            return csv_content

    return

def generate_csv_for_test(session: Session, experiment, results, test_number: int):
    results_dict = {
        "test_type": experiment.tests[test_number - 1].type,
        "results": []
    }
    if results_dict["test_type"] == "MUSHRA":
        results_dict["reference_file"] = experiment.tests[test_number - 1].reference.asset_path

    for r in results:
        result_dict = dict([r])
        for k, v in result_dict.items():
            for test_result in v:
                if test_result.test_number == test_number:
                    results_dict["results"].append(test_result)
    csv_data = prepare_csv_result(session, results_dict)
    return csv_data

def generate_pdf_for_experiment(session, experiment, experiment_name, results) -> bytes:
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    for idx, test in enumerate(experiment.tests):
        test_number = idx + 1
        test_results = []
        for r in results:
            result_dict = dict([r])
            for k, v in result_dict.items():
                for test_result in v:
                    if hasattr(test_result, 'test_number') and test_result.test_number == test_number:
                        test_results.append(test_result)
        if not test_results:
            continue
        match test.type:
            case "AB":
                all_questions = sorted({
                    selection.question_id
                    for result in test_results
                    for selection in result.selections
                })
                headers = ["Test type"] + [f"Question {i + 1}" for i in range(len(all_questions))] + [f"Sample {i + 1}" for i in range(len(all_questions))] + ["Feedback"]
                data_matrix = []
                for result in test_results:
                    row = [str(test.type)]
                    question_to_sample = {sel.question_id: sel.sample_id for sel in result.selections}
                    for question in all_questions:
                        row.append(question)
                    for question in all_questions:
                        row.append(question_to_sample.get(question, "Null"))
                    row.append(getattr(result, "feedback", "") or "")
                    data_matrix.append(row)
            case "ABX":
                all_questions = sorted({
                    selection.question_id
                    for result in test_results
                    for selection in result.selections
                })
                headers = ["Test type", "xSample", "xSelected"] + [f"Question {i + 1}" for i in range(len(all_questions))] + [f"Sample {i + 1}" for i in range(len(all_questions))] + ["Feedback"]
                data_matrix = []
                for result in test_results:
                    row = [str(test.type), result.x_sample_id, result.x_selected]
                    question_to_sample = {sel.question_id: sel.sample_id for sel in result.selections}
                    for question in all_questions:
                        row.append(question)
                    for question in all_questions:
                        row.append(question_to_sample.get(question, "Null"))
                    row.append(getattr(result, "feedback", "") or "")
                    data_matrix.append(row)
            case "MUSHRA":
                all_anchors = sorted({
                    anchor.sample_id
                    for result in test_results
                    for anchor in result.anchors_scores
                })
                all_samples = sorted({
                    sample.sample_id
                    for result in test_results
                    for sample in result.samples_scores
                })
                headers = ["Test type", "Reference File", "Reference Score"]
                for i in range(len(all_anchors)):
                    headers += [f"Anchor Sample {i+1}", f"Anchor Score {i+1}"]
                for i in range(len(all_samples)):
                    headers += [f"Sample {i+1}", f"Sample Score {i+1}"]
                headers += ["Feedback"]
                data_matrix = []
                for result in test_results:
                    reference_file = getattr(getattr(test, 'reference', None), 'asset_path', None)
                    row = [str(test.type), reference_file, result.reference_score if hasattr(result, 'reference_score') else ""]
                    for anchor in getattr(result, 'anchors_scores', []):
                        row.extend([anchor.sample_id, anchor.score])
                    for sample in getattr(result, 'samples_scores', []):
                        row.extend([sample.sample_id, sample.score])
                    row.append(getattr(result, "feedback", "") or "")
                    data_matrix.append(row)
            case "APE":
                all_samples = sorted({
                    sample.sample_id
                    for result in test_results
                    for axis in result.axis_results
                    for sample in axis.sample_ratings
                })
                headers = ["Test type", "Axis"]
                for i in range(len(all_samples)):
                    headers += [f"Sample {i+1}", f"Samp Score {i+1}"]
                headers += ["Feedback"]
                data_matrix = []
                for result in test_results:
                    for axis in result.axis_results:
                        row = [str(test.type), axis.axis_id]
                        for sample in axis.sample_ratings:
                            row.extend([sample.sample_id, sample.rating])
                        row.append(getattr(result, "feedback", "") or "")
                        data_matrix.append(row)
            case _:
                headers = []
                data_matrix = []
        for row in data_matrix:
            pdf.add_page()
            pdf.set_font("Arial", size=9)
            pdf.cell(0, 10, txt=f"Experiment: {experiment_name} - Test {test_number} ({test.type})", ln=True, align='C')
            pdf.ln(2)

            for i, header in enumerate(headers):
                value = row[i] if i < len(row) else ""
                pdf.set_fill_color(173, 216, 230)
                pdf.set_font("Arial", 'B', 9)
                pdf.cell(50, 8, str(header), border=1, align='L', fill=True)

                pdf.set_fill_color(255, 255, 255)
                pdf.set_font("Arial", '', 9)
                pdf.cell(130, 8, str(value), border=1, align='L', fill=True)

                pdf.ln(8)

    return pdf.output(dest='S').encode('latin1')

