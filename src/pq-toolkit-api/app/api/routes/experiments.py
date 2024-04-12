from typing import Any

from fastapi import APIRouter, UploadFile, Request
from app.schemas import *
import app.crud as crud
router = APIRouter()


@router.get("/", response_model=PqExperimentsList)
def get_experiments():
    return crud.get_experiments()


@router.post("/", response_model=PqExperimentsList)
def add_experiment(experiment_name: PqExperimentName):
    crud.add_experiment(experiment_name.name)
    return crud.get_experiments()


@router.post("/{experiment_name}", response_model=PqSuccessResponse)
def set_up_experiment(experiment_name: str, file: UploadFile):
    crud.upload_experiment_config(experiment_name, file)
    return PqSuccessResponse(success=True)


@router.get("/{experiment_name}", response_model=PqExperiment)
def get_experiment(experiment_name: str):
    return crud.get_experiment_by_name(experiment_name)


@router.delete("/", response_model=PqExperimentsList)
def delete_experiment(experiment_name: PqExperimentName):
    crud.remove_experiment_by_name(experiment_name.name)
    return crud.get_experiments()


@router.get("/{experiment_name}/samples", response_model=list[str])
def get_samples(experiment_name: str):
    return crud.get_experiment_samples(experiment_name)


@router.post("/{experiment_name}/samples", response_model=PqSuccessResponse)
def upload_sample(experiment_name: str, file: UploadFile):
    crud.upload_experiment_sample(experiment_name, file)
    return PqSuccessResponse(success=True)


@router.get("/{experiment_name}/samples/{filename}", response_model=UploadFile)
def get_sample(experiment_name: str, filename: str):
    return crud.get_experiment_sample(experiment_name, filename)


@router.delete("/{experiment_name}/samples/{filename}", response_model=PqSuccessResponse)
def delete_sample(experiment_name: str, filename: str):
    crud.delete_experiment_sample(experiment_name, filename)
    return PqSuccessResponse(success=True)


@router.get("/{experiment_name}/results", response_model=PqResultsList)
def get_results(experiment_name: str):
    return crud.get_experiments_results(experiment_name)


@router.post("/{experiment_name}/results", response_model=PqResultsList)
async def get_results(experiment_name: str, result_json: Request):
    res = await result_json.json()
    crud.add_experiment_result(experiment_name, res)
    return crud.get_experiments_results(experiment_name)


@router.get("/{experiment_name}/results/{result_name}", response_model=PqTestResultsList)
def get_test_results(experiment_name: str, result_name: str):
    return crud.get_experiment_tests_results(experiment_name, result_name)
