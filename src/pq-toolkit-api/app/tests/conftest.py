import pytest
from sqlmodel import Session, create_engine, SQLModel
from app.models import Experiment

@pytest.fixture(name="engine")
def engine_fixture():
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    return engine

@pytest.fixture(name="session")
def session_fixture(engine):
    with Session(engine) as session:
        yield session

@pytest.fixture
def experiment_data():
    return {
        "name": "Full Experiment Name",
        "description": "Experiment Description",
        "end_text": "Experiment End Text",
        "tests": [
            {
                "test_number": 1,
                "type": "AB",
                "samples": [{"sample_id": "s1", "asset_path": "file_sample_5.mp3"}],
                "questions": [{"question_id": "q1", "text": "Select better quality"}]
            }
        ]
    }

@pytest.fixture
def create_experiment(session):
    def _create_experiment(name):
        experiment = Experiment(name=name)
        session.add(experiment)
        session.commit()
        return experiment
    return _create_experiment

@pytest.fixture
def upload_config(session):
    from fastapi import UploadFile
    from io import BytesIO
    from app.crud import upload_experiment_config
    import json

    def _upload_config(experiment_name, config_data):
        json_file = UploadFile(filename="config.json", file=BytesIO(json.dumps(config_data).encode()))
        upload_experiment_config(session, experiment_name, json_file)
    return _upload_config
