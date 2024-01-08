import logging
from functools import wraps
from types import UnionType
from typing import get_type_hints

import requests
from pydantic import PydanticSchemaGenerationError, BaseModel
from requests import ConnectTimeout

from api_client.dataclasses import PqExperiment, PqTestResult
from api_client.exceptions import PqSerializationException, PqExperimentAlreadyExists


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

    @staticmethod
    def _request(**kwargs):
        try:
            response = requests.request(timeout=2.0, **kwargs)
            return response
        except ConnectTimeout:
            print("Connection timed out")

    def _get(self, path, **kwargs):
        return self._request(method="GET", url=self._endpoint + path, **kwargs)

    def _post(self, path, **kwargs):
        return self._request(method="POST", url=self._endpoint + path, **kwargs)

    def _delete(self, path, **kwargs):
        return self._request(method="DELETE", url=self._endpoint + path, **kwargs)

    @staticmethod
    def _serialize_with_pydantic(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            type_hints = get_type_hints(func)
            types_to_return = type_hints.get("return")

            if not types_to_return:
                raise PqSerializationException(f"Function {func.__name__} has not ben annotated with any return type")

            type_to_return = None
            if isinstance(types_to_return, UnionType):
                for iterable_type in types_to_return.__args__:
                    if iterable_type is not type(None):
                        type_to_return = iterable_type
                        if issubclass(iterable_type, BaseModel):
                            break
            else:
                type_to_return = types_to_return

            if not issubclass(type_to_return, BaseModel):
                raise PqSerializationException(f"Function {func.__name__} has not ben annotated with Pydantic's "
                                               f"BaseModel subclass or an Union with its subclass.")

            result = func(*args, **kwargs)

            if result is None:
                return None

            try:
                casted_result = type_to_return(**result)
                return casted_result
            except (RuntimeError, PydanticSchemaGenerationError) as e:
                raise PqSerializationException(f"Cannot cast the result to {types_to_return}: {e}")

        return wrapper

    def get_experiments(self) -> list[str]:
        response = self._get("/experiments")
        match response.status_code:
            case 200:
                experiments = response.json().get("experiments")
                return experiments
            case 404:
                return []

    @_serialize_with_pydantic
    def get_experiment(self, *, experiment_name: str) -> PqExperiment | None:
        response = self._get(f"/experiments/{experiment_name}")
        match response.status_code:
            case 200:
                experiment = response.json()
                return experiment
            case 404:
                return None

    def create_experiment(self, *, experiment_name: str) -> list[str]:
        response = self._post(f"/experiments", json={"name": f"{experiment_name}"})
        match response.status_code:
            case 200:
                experiments = response.json().get("experiments")
                return experiments
            case 409:
                raise PqExperimentAlreadyExists(experiment_name=experiment_name)

    def delete_experiment(self, *, experiment_name: str) -> list[str]:
        response = self._delete(f"/experiments", json={"name": f"{experiment_name}"})
        match response.status_code:
            case 200:
                experiments = response.json().get("experiments")
                return experiments

    def get_experiment_results(self, *, experiment_name: str) -> list[str]:
        response = self._get(f"/experiments/{experiment_name}/results").json()
        if experiment_results := response.get("results"):
            return experiment_results
        return []

    @_serialize_with_pydantic
    def get_experiment_result(self, *, experiment_name: str, result_name: str) -> PqTestResult | None:
        response = self._get(f"/experiments/{experiment_name}/results/{result_name}")
        match response.status_code:
            case 200:
                experiment_result = response.json().get("results")[0]
                return experiment_result
            case 404:
                return None
