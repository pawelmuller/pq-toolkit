from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.exceptions import ExceptionMiddleware

from app.api.main_router import api_router
from app.core.config import settings

import logging
from app.utils import PqException
from app.core.sample_manager import SampleDoesNotExistError, IllegalNamingError, S3Error


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    title=settings.PROJECT_NAME,
    root_path="/api/",
    generate_unique_id_function=custom_generate_unique_id,
)

# TODO: Log level based on env variables
logging.basicConfig(level=logging.INFO)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.exception_handler(PqException)
async def pq_exception_handler(request: Request, exc: PqException):
    return JSONResponse(
        status_code=418,
        content=exc.api_payload.model_dump(),
    )

app.include_router(api_router, prefix=settings.API_V1_STR)
