from fastapi import APIRouter

router = APIRouter()


@router.get("")
def get_experiments():
    return "Experiments"


@router.get("/{experiment_name}")
def get_experiment(experiment_name: str):
    return f"Experiment: {experiment_name}"
