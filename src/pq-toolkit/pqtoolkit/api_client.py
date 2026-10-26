import inspect
import logging
from functools import wraps
from types import UnionType, GenericAlias
from typing import get_type_hints, BinaryIO

import requests
from pydantic import PydanticSchemaGenerationError, BaseModel, ValidationError
from requests import ConnectTimeout

from pqtoolkit.dataclasses import PqExperiment, PqTestResultsList
from pqtoolkit.exceptions import (
    PqSerializationException,
    PqExperimentAlreadyExistsException,
    PqExperimentSetupException,
    PqExperimentSampleUploadException,
    NotAuthorisedError,
    DetailedError,
    IncorrectLogin,
)


class PqToolkitAPIClient:
    """
    Main class for the Pq Toolkit python client.

    When creating a new client object, class checks whether the backend is up and running.

    Parameters:
        base_host: The host of the API.
        base_port: The port of the API.
        api_version: Version of api, defaults to v1
        login: login for authorization (Optional)
        password: password for authorization (Optional)
    """

    def __init__(
        self,
        *,
        base_host: str = "http://localhost",
        base_port: int = 8000,
        api_version: str = "v1",
        login: str = None,
        password: str = None,
    ):
        self._base_host = base_host
        self._base_port = base_port
        self._oauth_token = None
        self._oauth_id = None
        self._endpoint = f"{self._base_host}:{self._base_port}/api/{api_version}"

        response = self._get("/status")
        status = response.json().get("status")
        if status != "HEALTHY":
            raise ConnectionError(f"Cannot read status from {self._endpoint}")
        logging.info(f"Connected to {self._endpoint}, status: HEALTHY")

        if login and password:
            self.log_in(login, password)

    def _request(self, **kwargs):
        try:
            if self.is_logged_in:
                if "headers" not in kwargs:
                    kwargs["headers"] = {}
                kwargs["headers"]["Authorization"] = self._auth_token

            response = requests.request(timeout=2.0, **kwargs)
            return response
        except ConnectTimeout:
            print("Connection timed out")
        except ConnectionError as e:
            print(f"Encountered an error during connection: {e}")

    def _get(self, path, **kwargs):
        return self._request(method="GET", url=self._endpoint + path, **kwargs)

    def _post(self, path, **kwargs):
        return self._request(method="POST", url=self._endpoint + path, **kwargs)

    def _delete(self, path, **kwargs):
        return self._request(method="DELETE", url=self._endpoint + path, **kwargs)

    @staticmethod
    def _serialize_with_pydantic(func):
        def _determine_return_type(types_to_return) -> (type, bool):
            type_to_return = None
            is_collection = False

            if isinstance(types_to_return, GenericAlias):
                is_collection = True
            if isinstance(types_to_return, UnionType):
                for iterable_type in types_to_return.__args__:
                    if iterable_type is not type(None):
                        type_to_return = iterable_type
                        if isinstance(iterable_type, GenericAlias):
                            is_collection = True
                            type_to_return = iterable_type.__args__[0]
                            break
                        if inspect.isclass(iterable_type) and issubclass(iterable_type, BaseModel):
                            break
            else:
                type_to_return = types_to_return

            return type_to_return, is_collection

        def _parse_response(result, is_collection, type_to_return):
            if is_collection:
                collection = []
                for item in result:
                    casted_item = type_to_return(**item)
                    collection.append(casted_item)
                return collection
            else:
                casted_result = type_to_return(**result)
                return casted_result

        @wraps(func)
        def wrapper(*args, **kwargs):
            type_hints = get_type_hints(func, include_extras=True)
            types_to_return = type_hints.get("return")

            if not types_to_return:
                raise PqSerializationException(f"Function {func.__name__} has not ben annotated with any return type")

            type_to_return, is_collection = _determine_return_type(types_to_return)

            if not issubclass(type_to_return, BaseModel):
                raise PqSerializationException(
                    f"Function {func.__name__} has not ben annotated with Pydantic's "
                    f"BaseModel subclass or an Union with its subclass.")

            result = func(*args, **kwargs)

            if result is None:
                return None

            try:
                casted_result = _parse_response(result, is_collection, type_to_return)
                return casted_result
            except (RuntimeError, PydanticSchemaGenerationError, ValidationError) as e:
                raise PqSerializationException(f"Cannot cast the result to {types_to_return}: {e}")

        return wrapper

    @property
    def _auth_token(self):
        return f"{self._oauth_id} {self._oauth_token}"

    def log_in(self, login: str, password: str):
        """Logs in the user, obtains a valid token for authorization

        Args:
            login (str): user name
            password (str): password

        Raises:
            IncorrectLogin: When wrong credidentials are provided
        """
        data = {"username": login, "password": password}
        resp = self._post("/auth/login", data=data)

        match resp.status_code:
            case 200:
                pass
            case _:
                raise IncorrectLogin()
        resp = resp.json()
        self._oauth_token = resp["access_token"]
        self._oauth_id = resp["token_type"]

    def get_user(self) -> dict:
        """Reutrns user information

        Returns:
            dict: user information dict
        """
        return self._get("/auth/user").json()

    @property
    def is_logged_in(self) -> bool:
        """Checks if api client has obtained authorization token already

        Returns:
            bool: Is authorized
        """
        return self._oauth_id and self._oauth_token

    def get_experiments(self) -> list[str]:
        """
        Method allows to get a list of all experiments currently defined.

        Returns:
            experiments: A list of strings representing names of the experiments.
        """
        response = self._get("/experiments")
        match response.status_code:
            case 200:
                experiments = response.json().get("experiments")
                return experiments
            case 404:
                return []

    @_serialize_with_pydantic
    def get_experiment(self, *, experiment_name: str) -> PqExperiment | None:
        """
        Method allows to get a single experiment with all its configuration.

        Parameters:
            experiment_name: The name of the experiment.

        Returns:
            experiment: An object representing given experiment.
        """

        response = self._get(f"/experiments/{experiment_name}")
        match response.status_code:
            case 200:
                experiment = response.json()
                return experiment
            case 404:
                return None

    def create_experiment(self, *, experiment_name: str) -> list[str]:
        """
        Method allows to create an experiment.

        Parameters:
            experiment_name: The name of the experiment.

        Returns:
            experiments: A list of strings representing names of the experiments.

        Raises:
            PqExperimentAlreadyExistsException: If the experiment of given name already exists.
        """
        response = self._post("/experiments", json={"name": f"{experiment_name}"})
        match response.status_code:
            case 200:
                experiments = response.json().get("experiments")
                return experiments
            case 409:
                raise PqExperimentAlreadyExistsException(experiment_name=experiment_name)
            case 401:
                raise NotAuthorisedError()
            case _:
                raise DetailedError(response.json())

    def delete_experiment(self, *, experiment_name: str) -> list[str]:
        """
        Method allows to delete an experiment.

        Parameters:
            experiment_name: The name of the experiment.

        Returns:
            experiments: A list of strings representing names of the experiments.
        """

        response = self._delete("/experiments", json={"name": f"{experiment_name}"})
        match response.status_code:
            case 200:
                experiments = response.json().get("experiments")
                return experiments
            case 401:
                raise NotAuthorisedError()
            case 404:
                pass
            case _:
                raise DetailedError(response.json())

    def setup_experiment(self, *, experiment_name: str, experiment_setup: PqExperiment):
        """
        Method allows to create an experiment.

        Parameters:
            experiment_name: The name of the experiment.
            experiment_setup: The experiment setup object

        Raises:
            PqExperimentSetupException: Either when the given configuration is invalid or the API returns an error.
        """

        if not isinstance(experiment_setup, PqExperiment):
            raise PqExperimentSetupException(experiment_name=experiment_name,message="The experiment settings must be a PqExperiment")
        model_dict = experiment_setup.model_dump_json(by_alias=True, exclude_none=True)
        files_struct = {
            "file": (
                "setup.json",
                model_dict,
                "application/json",
                {"Content-Disposition": "form-data"},
            )
        }
        response = self._post(f"/experiments/{experiment_name}", files=files_struct)

        match response.status_code:
            case 200:
                is_success = response.json().get("success")
                if not is_success:
                    raise PqExperimentSetupException(experiment_name=experiment_name)
            case 400:
                message = response.json().get("message")
                raise PqExperimentSetupException(experiment_name=experiment_name, message=message)
            case 401:
                raise NotAuthorisedError()
            case _:
                raise DetailedError(response.json())

    def upload_sample(self, *, experiment_name: str, sample_name: str, sample_binary: bytes | BinaryIO):
        """
        Method allows to upload a sample to the experiment.

        Parameters:
            experiment_name: The name of the experiment.
            sample_name: The name of the sample (must match the sample name in the experiment setup).
            sample_binary: The music file itself.

        Raises:
            PqExperimentSampleUploadException: When the API returns an error.
        """

        files_struct = {
            "file": (
                sample_name,
                sample_binary,
                "audio/mpeg",
                {"Content-Disposition": "form-data"},
            )
        }
        response = self._post(f"/experiments/{experiment_name}/samples", files=files_struct)

        match response.status_code:
            case 200:
                is_success = response.json().get("success")
                if not is_success:
                    raise PqExperimentSampleUploadException(experiment_name=experiment_name, sample_name=sample_name)
            case 400:
                message = response.json().get("message")
                raise PqExperimentSampleUploadException( experiment_name=experiment_name, sample_name=sample_name, message=message)
            case 401:
                raise NotAuthorisedError()
            case _:
                raise DetailedError(response.json())

    def get_experiment_results(self, *, experiment_name: str) -> list[str]:
        """
        Method allows to get a list of experiments' results' names.

        Parameters:
            experiment_name: The name of the experiment.

        Returns:
            experiment_results: list of experiments' results' names.
        """

        response = self._get(f"/experiments/{experiment_name}/results").json()
        if experiment_results := response.get("results"):
            return experiment_results
        return []

    @_serialize_with_pydantic
    def get_experiment_test_results(self, *, experiment_name: str, result_name: str) -> PqTestResultsList | None:
        """
        Method allows to get a list of experiments' results' names.

        Parameters:
            experiment_name: The name of the experiment.
            result_name: The name of the experiment result.

        Returns:
            experiment_results: An object representing the experiment's results'.
        """

        response = self._get(f"/experiments/{experiment_name}/results/{result_name}")
        match response.status_code:
            case 200:
                experiment_results = response.json()
                return experiment_results
            case 404:
                return None
            case 401:
                raise NotAuthorisedError()
            case _:
                raise DetailedError(response.json())
