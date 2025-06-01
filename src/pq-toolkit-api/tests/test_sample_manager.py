from app.core.sample_manager import SampleManager, SampleDoesNotExistError
from io import BytesIO
import pytest


@pytest.fixture
def example_byte_stream():
    message = "Hello world!"
    return BytesIO(message.encode()), message


@pytest.fixture
def sample_manager_localhost():
    return SampleManager(
        endpoint="pq-sample-storage-minio-dev",
        port=9000,
        access_key="minioadmin",
        secret_key="minioadmin",
        sample_bucket_name="testbucket",
    )


def test_manager_init(sample_manager_localhost: SampleManager):
    pass


def test_manager_complete(
    example_byte_stream: tuple[BytesIO, str], sample_manager_localhost: SampleManager
):
    byte_stream_out, message = example_byte_stream
    manager = sample_manager_localhost

    filename = "test.wav"
    experiment_name = "test"
    manager.upload_sample(experiment_name, filename, byte_stream_out)

    machting_samples = manager.list_matching_samples(experiment_name)
    assert filename in machting_samples

    for data in manager.get_sample(experiment_name, filename):
        assert data.decode() == message

    manager.remove_sample(experiment_name, filename)


def test_manager_non_existent_file(sample_manager_localhost: SampleManager):
    with pytest.raises(SampleDoesNotExistError):
        for _ in sample_manager_localhost.get_sample("this", "does not exist"):
            pass

    with pytest.raises(SampleDoesNotExistError):
        for _ in sample_manager_localhost.get_sample("this", "does not exista again"):
            pass
