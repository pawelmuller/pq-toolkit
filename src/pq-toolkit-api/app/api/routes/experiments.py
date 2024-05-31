from fastapi import APIRouter, UploadFile, Request

from app.api.deps import SessionDep, SampleManagerDep, CurrentAdmin
from app.schemas import (
    PqExperimentsList,
    PqExperimentName,
    PqSuccessResponse,
    PqExperiment,
    PqTestResultsList,
)
import app.crud as crud

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


@router.get("/{experiment_name}/samples/{filename}", response_model=UploadFile)
async def get_sample(
    sample_manager: SampleManagerDep, experiment_name: str, filename: str
):
    return crud.get_experiment_sample(sample_manager, experiment_name, filename)


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
async def upload_results(
    session: SessionDep, experiment_name: str, result_json: Request
):
    res = await result_json.json()
    return crud.add_experiment_result(session, experiment_name, res)


@router.get(
    "/{experiment_name}/results/{result_name}", response_model=PqTestResultsList
)
def get_test_results(session: SessionDep, experiment_name: str, result_name: str):
    return crud.get_experiment_tests_results(session, experiment_name, result_name)
