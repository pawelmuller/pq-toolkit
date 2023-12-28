from fastapi import APIRouter

router = APIRouter()


@router.get("")
def get_experiment_assets(experiment_name: str):
    return []


@router.get("/{asset_name}")
def get_experiment_asset(experiment_name: str, asset_name: str):
    return f"Asset: {asset_name} for experiment: {experiment_name}"
