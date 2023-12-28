from fastapi import FastAPI, APIRouter

from consts import API_V1_PREFIX
from api.api_v1.endpoints import assets, experiments, samples


class PqToolkitAPI(FastAPI):
    def __init__(self, *args, **kwargs):
        super().__init__(
            *args,
            openapi_url=f"{API_V1_PREFIX}/openapi.json",
            **kwargs
        )

        api_v1_main_router = APIRouter(prefix=API_V1_PREFIX)
        api_v1_main_router.include_router(experiments.router,
                                          prefix="/experiments",
                                          tags=["Experiments"])
        api_v1_main_router.include_router(samples.router,
                                          prefix="/experiments/{experiment_name}/samples",
                                          tags=["Samples"])
        api_v1_main_router.include_router(assets.router,
                                          prefix="/experiments/{experiment_name}/assets",
                                          tags=["Assets"])

        self.include_router(api_v1_main_router)
