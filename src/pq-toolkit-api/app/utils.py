from io import BytesIO
from app.schemas import PqErrorResponse
from urllib3.response import HTTPResponse


class PqException(Exception):
    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.api_payload = PqErrorResponse(message=message)
