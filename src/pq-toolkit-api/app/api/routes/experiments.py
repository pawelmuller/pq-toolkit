from fastapi import APIRouter, UploadFile, Request, Response, Form
from fastapi.responses import StreamingResponse
import zipfile
import os
from app.api.deps import SessionDep, SampleManagerDep, CurrentAdmin
from app.schemas import (
    PqExperimentsList,
    PqExperimentName,
    PqSuccessResponse,
    PqExperiment,
    PqTestResultsList,
PqSamplePaths,
)
import app.crud as crud
from typing import List
from io import StringIO, BytesIO

router = APIRouter()


@router.get("/", response_model=PqExperimentsList)
def get_experiments(session: SessionDep):
    return crud.get_experiments(session)



@router.post("/", response_model=PqExperimentsList)
def add_experiment(
    session: SessionDep, admin: CurrentAdmin, experiment_name: PqExperimentName
):
    crud.add_experiment(session, experiment_name.name)
    return crud.get_experiments(session)


@router.post("/{experiment_name}", response_model=PqSuccessResponse)
def set_up_experiment(
    session: SessionDep, admin: CurrentAdmin, experiment_name: str, file: UploadFile
):
    crud.upload_experiment_config(session, experiment_name, file)
    return PqSuccessResponse(success=True)


@router.get("/{experiment_name}", response_model=PqExperiment)
def get_experiment(session: SessionDep, experiment_name: str):
    return crud.get_experiment_by_name(session, experiment_name)


@router.delete("/", response_model=PqExperimentsList)
def delete_experiment(
    session: SessionDep, admin: CurrentAdmin, experiment_name: PqExperimentName
):
    crud.remove_experiment_by_name(session, experiment_name.name)
    return crud.get_experiments(session)


@router.get("/{experiment_name}/samples", response_model=list[str])
def get_samples(sample_manager: SampleManagerDep, experiment_name: str):
    return crud.get_experiment_samples(sample_manager, experiment_name)


@router.post("/{experiment_name}/samples", response_model=PqSuccessResponse)
def upload_sample(
    sample_manager: SampleManagerDep,
    admin: CurrentAdmin,
    experiment_name: str,
    file: UploadFile,
):
    crud.upload_experiment_sample(sample_manager, experiment_name, file)
    return PqSuccessResponse(success=True)


@router.post("/{experiment_name}/samples/v2", response_model=PqSamplePaths)
def upload_sample_v2(
    session: SessionDep,
    sample_manager: SampleManagerDep,
    experiment_name: str,
    files: List[UploadFile] = Form(default_factory=list),
    titles: List[str] = Form(default_factory=list),
    sample_ids: List[int] = Form(default_factory=list)
):

    samples_paths = []

    if files:
        for file in files:
            upload_path = crud.upload_experiment_sample(sample_manager, experiment_name, file)
            samples_paths.append(crud.create_sample(session, upload_path, None))

    if sample_ids:
        for sample_id in sample_ids:
            samples_paths.append(crud.assign_sample_to_experiment(session, sample_manager, experiment_name, sample_id))

    return PqSamplePaths(asset_path=samples_paths)

@router.get("/{experiment_name}/samples/{filename}", response_model=UploadFile)
async def get_sample(
    sample_manager: SampleManagerDep, experiment_name: str, filename: str
):
    return crud.get_experiment_sample(sample_manager, experiment_name, filename)

@router.get("/{experiment_name}/{test_number}/download_csv", response_class=Response)
def download_results_csv(session: SessionDep, experiment_name: str, test_number: int, test_type: str):
    experiment = crud.get_experiment_by_name(session, experiment_name)
    results = crud.get_experiment_tests_results(session, experiment_name)

    csv_data = crud.generate_csv_for_test(session, experiment, results, test_number)

    output = StringIO()
    output.write(csv_data)
    output.seek(0)
    response = StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
    )
    response.headers["Content-Disposition"] = f"attachment; filename={experiment.name}_test_{test_number}_{test_type}.csv"
    return response

@router.get("/{experiment_name}/download_csv", response_class=Response)
def download_results_csv_all(session: SessionDep, experiment_name: str):

    experiment = crud.get_experiment_by_name(session, experiment_name)
    results = crud.get_experiment_tests_results(session, experiment_name)

    temp_dir = "temp_files"
    os.makedirs(temp_dir, exist_ok=True)
    csv_files = []
    for test_it in range(len(experiment.tests)):
        csv_file = os.path.join(temp_dir, f"{experiment.name}_test_{test_it+1}_{experiment.tests[test_it].type}.csv")
        csv_files.append(csv_file)
        csv_data = crud.generate_csv_for_test(session, experiment, results, test_it+1)
        with open(csv_file, "w", newline="") as f:
            f.write(csv_data)

    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for csv_file in csv_files:
            zip_file.write(csv_file, arcname=os.path.basename(csv_file))

    zip_buffer.seek(0)
    for csv_file in csv_files:
        os.remove(csv_file)
    os.rmdir(temp_dir)

    headers = {"Content-Disposition": f"attachment; filename={experiment.name}.zip"}
    return StreamingResponse(zip_buffer, media_type="application/zip", headers=headers)

@router.get("/{experiment_name}/download_pdf", response_class=Response)
def download_results_pdf_all(session: SessionDep, experiment_name: str):
    experiment = crud.get_experiment_by_name(session, experiment_name)
    results = crud.get_experiment_tests_results(session, experiment_name)
    pdf_data = crud.generate_pdf_for_experiment(session, experiment, experiment_name, results)
    headers = {"Content-Disposition": f"attachment; filename={experiment_name}_all_tests.pdf"}
    return StreamingResponse(iter([pdf_data]), media_type="application/pdf", headers=headers)


@router.delete(
    "/{experiment_name}/samples/{filename}", response_model=PqSuccessResponse
)
def delete_sample(
    sample_manager: SampleManagerDep,
    admin: CurrentAdmin,
    experiment_name: str,
    filename: str,
):
    crud.delete_experiment_sample(sample_manager, experiment_name, filename)
    return PqSuccessResponse(success=True)


@router.get("/{experiment_name}/results", response_model=PqTestResultsList)
def get_results(session: SessionDep, experiment_name: str):
    return crud.get_experiment_tests_results(session, experiment_name)


@router.post("/{experiment_name}/results", response_model=PqTestResultsList)
async def upload_results(session: SessionDep, experiment_name: str, result_json: Request):
    res = await result_json.json()
    return crud.add_experiment_result(session, experiment_name, res)


@router.get(
    "/{experiment_name}/results/{result_name}", response_model=PqTestResultsList
)
def get_test_results(session: SessionDep, experiment_name: str, result_name: str):
    return crud.get_experiment_tests_results(session, experiment_name, result_name)
