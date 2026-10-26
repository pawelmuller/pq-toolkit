from minio import Minio
import minio
import minio.datatypes
from io import IOBase
from urllib3.response import HTTPResponse
from pydantic_settings import BaseSettings
from app.utils import PqException
from minio.commonconfig import CopySource


class SampleDoesNotExistError(PqException):
    def __init__(self, sample_name: str) -> None:
        super().__init__(f"Sample {sample_name} does not exist!", 404)


class IllegalNamingError(PqException):
    def __init__(self, illegal_character: str) -> None:
        super().__init__(
            f"Experiment or sample contains illegal character: {illegal_character}"
        )


class S3Error(PqException):
    def __init__(self, code: str) -> None:
        super().__init__(f"S3 Error: {code}")


class SampleManager:
    """Wrapper class for a MinIO client. Manages sample recording files."""

    _SEPARATOR = "/"

    def __init__(
        self,
        endpoint: str,
        port: int,
        access_key: str,
        secret_key: str,
        sample_bucket_name: str = "samples",
    ) -> None:
        """Creates manager object

        Args:
            endpoint (str): s3 compatible bucket service endpoint (for example MinIO image)
            port (int): bucket service port
            access_key (str): service access key / username
            secret_key (str): service secret key / password
            sample_bucket_name (str, optional): Bucket name to store samples in. Defaults to "samples".
        """
        self._sample_bucket_name = sample_bucket_name
        self._client = Minio(
            endpoint=f"{endpoint}:{port}",
            access_key=access_key,
            secret_key=secret_key,
            secure=False,
        )
        self._ensure_bucket_exists()

    @classmethod
    def from_settings(cls, settings: BaseSettings):
        return cls(
            endpoint=settings.MINIO_ENDPOINT,
            port=settings.MINIO_PORT,
            access_key=settings.MINIO_ROOT_USER,
            secret_key=settings.MINIO_ROOT_PASSWORD,
        )

    def _object_name_from_experiment_and_sample(
        self, experiment_name: str, sample_name: str
    ) -> str:
        if self._SEPARATOR in experiment_name or self._SEPARATOR in sample_name:
            raise IllegalNamingError(self._SEPARATOR)
        return f"{experiment_name}{self._SEPARATOR}{sample_name}"

    def _ensure_bucket_exists(self):
        if not self._client.bucket_exists(self._sample_bucket_name):
            self._client.make_bucket(self._sample_bucket_name)

    def _check_object_exists(self, object_name: str) -> bool:
        try:
            self._client.stat_object(self._sample_bucket_name, object_name)
            return True
        except minio.error.S3Error:
            return False

    def check_sample_exists(self, experiment_name: str, sample_name: str):
        """Use front-end side checking instead, by default the API doesnt handle overwriting and deleting non existent files

        Args:
            experiment_name (str): _description_
            sample_name (str): _description_

        Returns:
            boolean: existence
        """
        object_name = self._object_name_from_experiment_and_sample(
            experiment_name, sample_name
        )
        return self._check_object_exists(object_name)

    def upload_sample(
        self, experiment_name: str, sample_name: str, sample_data: IOBase
    ):
        object_name = self._object_name_from_experiment_and_sample(
            experiment_name, sample_name
        )
        try:
            self._client.put_object(
                self._sample_bucket_name,
                object_name,
                sample_data,
                length=-1,
                part_size=10 * 1024 * 1024,
            )
            return object_name
        except minio.error.S3Error as e:
            raise S3Error(e.code)

    def upload_sample_directly(
        self, sample_name: str, sample_data: IOBase
    ):
        object_name = self._object_name_from_experiment_and_sample(
            "directly", sample_name
        )
        try:
            self._client.put_object(
                self._sample_bucket_name,
                object_name,
                sample_data,
                length=-1,
                part_size=10 * 1024 * 1024,
            )
            return object_name
        except minio.error.S3Error as e:
            raise S3Error(e.code)

    def copy_sample(self, source_object_name, target_experiment_name: str,
                    target_sample_name: str):

        target_object_name = self._object_name_from_experiment_and_sample(
            target_experiment_name, target_sample_name
        )

        try:
            self._client.copy_object(
                bucket_name=self._sample_bucket_name,
                object_name=target_object_name,
                source=CopySource(self._sample_bucket_name, source_object_name)
            )
            return target_object_name
        except minio.error.S3Error as e:
            raise S3Error(e.code)

    def _sample_data_generator(self, response: HTTPResponse, chunk_size: int):
        try:
            data = response.read(chunk_size)
            while data:
                yield data
                data = response.read(chunk_size)
        finally:
            response.close()
            response.release_conn()

    def get_sample(
        self, experiment_name: str, sample_name: str, chunk_size: int = 1024 * 1024
    ):
        object_name = self._object_name_from_experiment_and_sample(
            experiment_name, sample_name
        )

        if not self.check_sample_exists(experiment_name, sample_name):
            raise SampleDoesNotExistError(object_name)

        try:
            response: HTTPResponse = self._client.get_object(
                self._sample_bucket_name, object_name
            )
        except minio.error.S3Error as e:
            raise S3Error(e.code)

        return self._sample_data_generator(response, chunk_size)

    def get_sample_directly(
            self, sample_name: str, chunk_size: int = 1024 * 1024
    ):

        if not self._check_object_exists(sample_name):
            raise SampleDoesNotExistError(sample_name)

        try:
            response: HTTPResponse = self._client.get_object(
                self._sample_bucket_name, sample_name
            )
        except minio.error.S3Error as e:
            raise S3Error(e.code)

        return self._sample_data_generator(response, chunk_size)

    def remove_sample(self, experiment_name: str, sample_name: str):
        object_name = self._object_name_from_experiment_and_sample(
            experiment_name, sample_name
        )

        if not self.check_sample_exists(experiment_name, sample_name):
            raise SampleDoesNotExistError(object_name)

        self._client.remove_object(self._sample_bucket_name, object_name)


    def remove_sample_directly(self, object_name: str):

        if not self._check_object_exists(object_name):
            raise SampleDoesNotExistError(object_name)

        self._client.remove_object(self._sample_bucket_name, object_name)

    def list_matching_samples(self, experiment_name: str) -> list[str]:
        sample_names = []

        bucket_objects_iterator = self._client.list_objects(
            bucket_name=self._sample_bucket_name,
            prefix=experiment_name + self._SEPARATOR,
        )

        for obj in bucket_objects_iterator:
            obj: minio.datatypes.Object
            experiment_name, sample_name = obj.object_name.split("/")
            sample_names.append(sample_name)
        return sample_names

    def remove_all_samples(self):
        self._client.remove_bucket(self._sample_bucket_name)
