from io import BytesIO
from app.schemas import PqErrorResponse
from urllib3.response import HTTPResponse


class PqException(Exception):
    def __init__(self, message: str, error_code: int = 400) -> None:
        super().__init__(message)
        self.api_payload = PqErrorResponse(message=message)
        self.error_code = error_code
