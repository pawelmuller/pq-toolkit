from io import BytesIO
from app.schemas import PqErrorResponse
from urllib3.response import HTTPResponse


def sample_stream(sample: HTTPResponse, chunk_size: int = 1024*1024):
    data = sample.read(chunk_size)
    while data:
        yield data
        data = sample.read(chunk_size)


class PqException(Exception):
    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.api_payload = PqErrorResponse(message=message)
