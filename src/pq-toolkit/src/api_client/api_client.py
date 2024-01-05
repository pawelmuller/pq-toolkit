import logging
from functools import wraps
from typing import get_type_hints

import requests
from pydantic import PydanticSchemaGenerationError, BaseModel
from requests import ConnectTimeout

from api_client.dataclasses import PqExperiment
from api_client.exceptions import PqToolkitException


class PqToolkitAPIClient:
    def __init__(self, *, base_host: str = "http://localhost", base_port: int = 3000):
        self._base_host = base_host
        self._base_port = base_port
        self._endpoint = f"{self._base_host}:{self._base_port}/api/v1"

        response = self._get("/status",)
        status = response.json().get("status")
        if status != "HEALTHY":
            raise ConnectionError(f"Cannot read status from {self._endpoint}")
        logging.info(f"Connected to {self._endpoint}, status: HEALTHY")

    def _request(self, **kwargs):
        try:
            response = requests.request(timeout=2.0, **kwargs)
            return response
        except ConnectTimeout:
            print("Connection timed out")

    def _get(self, path, **kwargs):
        return self._request(method="GET", url=self._endpoint + path, **kwargs)

    def _post(self, path, **kwargs):
        return self._request(method="POST", url=self._endpoint + path, **kwargs)

    @staticmethod
    def _serialize_with_pydantic(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            type_hints = get_type_hints(func)
            type_to_return = type_hints.get("return")
            if not type_to_return:
                raise PqToolkitException(f"Function {func.__name__} has not ben annotated with any return type")
            if not issubclass(type_to_return, BaseModel):
                raise PqToolkitException(f"Function {func.__name__} has not ben annotated with Pydantic return type")

            result = func(*args, **kwargs)

            try:
                casted_result = type_to_return(**result)
                return casted_result
            except (RuntimeError, PydanticSchemaGenerationError) as e:
                raise TypeError(f"Cannot cast the result to {type_to_return}: ", e)

        return wrapper

    def get_experiments(self) -> list[str]:
        response = self._get("/experiments")
        try:
            json = response.json()
            if experiments := json.get("experiments"):
                return experiments
            return []
        except Exception:
            return None

    @_serialize_with_pydantic
    def get_experiment(self, *, name: str) -> PqExperiment:
        # TODO: Experiment name validation
        response = requests.get(self._endpoint + f"/experiments/{name}")
        json = response.json()
        return json
