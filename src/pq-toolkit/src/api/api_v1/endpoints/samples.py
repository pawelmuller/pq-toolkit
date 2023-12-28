from fastapi import APIRouter

router = APIRouter()


@router.get("")
def get_experiment_samples(experiment_name: str):
    return []


@router.get("/{sample_name}")
def get_experiment_sample(experiment_name: str, sample_name: str):
    return f"Sample: {sample_name} for experiment: {experiment_name}"
