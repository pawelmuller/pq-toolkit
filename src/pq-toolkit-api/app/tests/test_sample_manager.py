from app.core.sample_manager import SampleManager
from app.core.config import settings
from io import BytesIO
import pytest


@pytest.fixture
def example_byte_stream():
    message = "Hello world!"
    return BytesIO(message.encode()), message


def test_manager_init():
    manager = SampleManager.from_settings(settings)


def test_manager_complete(example_byte_stream: tuple):
    byte_stream_out, message = example_byte_stream
    manager = SampleManager.from_settings(settings)
    filename = "test.wav"
    manager.upload_sample(filename, byte_stream_out)

    byte_stream_in = manager.get_sample(filename)
    assert byte_stream_in.decode() == message
    manager.remove_sample(filename)
