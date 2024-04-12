from minio import Minio
from pydantic import AnyUrl
from io import FileIO
from urllib3.response import HTTPResponse
from pydantic_settings import BaseSettings


class SampleManager:
    def __init__(self, endpoint: AnyUrl, port: int, access_key: str, secret_key: str, sample_bucket_name: str = "samples") -> None:
        self._sample_bucket_name = sample_bucket_name
        self._client = Minio(
            endpoint=f"{endpoint}:{port}",
            access_key=access_key,
            secret_key=secret_key,
            secure=False
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

    def _ensure_bucket_exists(self):
        if not self._client.bucket_exists(self._sample_bucket_name):
            self._client.make_bucket(self._sample_bucket_name)

    def upload_sample(self, sample_name: str, sample_data: FileIO):
        self._client.put_object(self._sample_bucket_name,
                                sample_name, sample_data, length=-1, part_size=10*1024*1024)

    def get_sample(self, sample_name: str):
        try:
            response: HTTPResponse = self._client.get_object(
                self._sample_bucket_name, sample_name)
            data = response.read()
        finally:
            response.close()
            response.release_conn()
            return data

    def remove_sample(self, sample_name: str):
        self._client.remove_object(self._sample_bucket_name, sample_name)
