from io import BytesIO
from app.schemas import PqErrorResponse


def content_stream_from_bytes(sample_bytes: bytes):
    yield from BytesIO(sample_bytes)


class PqException(Exception):
    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.api_payload = PqErrorResponse(message=message)
