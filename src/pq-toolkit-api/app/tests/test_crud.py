import pytest
from sqlmodel import select
from app.crud import (
    get_experiment_by_name,
    add_experiment,
    remove_experiment_by_name,
    add_experiment_result,
    ExperimentNotFound,
    ExperimentAlreadyExists,
    ExperimentNotConfigured,
    IncorectInputData

)
from app.models import Experiment
from app.schemas import PqTestResultsList, PqTestABResult, PqTestAPEResult, PqTestABXResult, PqTestMUSHRAResult
from pydantic import ValidationError




def test_add_experiment(session, create_experiment):
    experiment_name = "Test Experiment"
    experiment = create_experiment(experiment_name)
    retrieved_experiment = session.exec(select(Experiment).where(Experiment.name == experiment_name)).one()
    assert retrieved_experiment.name == experiment_name

def test_add_experiment_already_exists(session, create_experiment):
    experiment_name = "Test Experiment"
    create_experiment(experiment_name)
    with pytest.raises(ExperimentAlreadyExists):
        add_experiment(session, experiment_name)

def test_get_experiment_no_configured(session, create_experiment):
    experiment_name = "Test Experiment"
    create_experiment(experiment_name)
    with pytest.raises(ExperimentNotConfigured):
        get_experiment_by_name(session, experiment_name)

def test_get_experiment_by_name_not_found(session):
    with pytest.raises(ExperimentNotFound):
        get_experiment_by_name(session, "Nonexistent Experiment")

def test_upload_experiment_config(session, create_experiment, upload_config, experiment_data):
    experiment_name = "Test Experiment"
    create_experiment(experiment_name)
    upload_config(experiment_name, experiment_data)
    experiment = get_experiment_by_name(session, experiment_name)
    assert experiment.name == experiment_data["name"]
    assert experiment.description == experiment_data["description"]
    assert len(experiment.tests) == 1
    assert experiment.tests[0].test_number == experiment_data["tests"][0]["test_number"]

def test_remove_experiment_by_name(session, create_experiment, upload_config, experiment_data):
    experiment_name = "Test Experiment"
    create_experiment(experiment_name)
    upload_config(experiment_name, experiment_data)
    remove_experiment_by_name(session, experiment_name)
    with pytest.raises(ExperimentNotFound):
        get_experiment_by_name(session, experiment_name)

@pytest.mark.parametrize("config_data, test_result, expected_result_type", [
    (
        {
            "name": "Full Experiment Name",
            "description": "Experiment Description",
            "end_text": "Experiment End Text",
            "tests": [
                {
                    "test_number": 1,
                    "type": "AB",
                    "samples": [
                        {"sample_id": "s1", "asset_path": "file_sample_5.mp3"},
                        {"sample_id": "s2", "asset_path": "file_sample_700.mp3"}
                    ],
                    "questions": [
                        {"question_id": "q1", "text": "Select better quality"},
                        {"question_id": "q2", "text": "Select more warmth"}
                    ]
                }
            ]
        },
        {
            "results": [
                {
                    "testNumber": 1,
                    "selections": [
                        {"questionId": "q1", "sampleId": "s1"},
                        {"questionId": "q2", "sampleId": "s2"}
                    ]
                }
            ]
        },
        PqTestABResult
    ),
    (
        {
            "name": "Full Experiment Name",
            "description": "Experiment Description",
            "end_text": "Experiment End Text",
            "tests": [
                {
                    "test_number": 1,
                    "type": "ABX",
                    "samples": [
                        {"sample_id": "s1", "asset_path": "file_sample_5.mp3"},
                        {"sample_id": "s2", "asset_path": "file_sample_700.mp3"}
                    ],
                    "questions": [
                        {"question_id": "q1", "text": "Select better quality"},
                        {"question_id": "q2", "text": "Select more warmth"}
                    ],
                    "x_sample_id": None
                }
            ]
        },
        {
            "results": [
                {
                    "testNumber": 1,
                    "xSampleId": "s1",
                    "xSelected": "s1",
                    "selections": [
                        {"questionId": "q1", "sampleId": "s2"},
                        {"questionId": "q2", "sampleId": "s1"}
                    ]
                }
            ]
        },
        PqTestABXResult
    ),
    (
        {
            "name": "Full Experiment Name",
            "description": "Experiment Description",
            "end_text": "Experiment End Text",
            "tests": [
                {
                    "test_number": 3,
                    "type": "APE",
                    "axis": [
                        {"question_id": "a1", "text": "Quality"},
                        {"question_id": "a2", "text": "Depth"}
                    ],
                    "samples": [
                        {"sample_id": "s1", "asset_path": "file_sample_5.mp3"},
                        {"sample_id": "s2", "asset_path": "file_sample_700.mp3"},
                        {"sample_id": "s3", "asset_path": "sample-12s.mp3"}
                    ]
                }
            ]
        },
        {
            "results": [
                {
                    "testNumber": 3,
                    "axisResults": [
                        {
                            "axisId": "a1",
                            "sampleRatings": [
                                {"sampleId": "s1", "rating": 29},
                                {"sampleId": "s2", "rating": 64},
                                {"sampleId": "s3", "rating": 81}
                            ]
                        },
                        {
                            "axisId": "a2",
                            "sampleRatings": [
                                {"sampleId": "s1", "rating": 77},
                                {"sampleId": "s2", "rating": 38},
                                {"sampleId": "s3", "rating": 84}
                            ]
                        }
                    ]
                }
            ]
        },
        PqTestAPEResult
    ),
    (
        {
            "name": "Full Experiment Name",
            "description": "Experiment Description",
            "end_text": "Experiment End Text",
            "tests": [
                {
                    "test_number": 4,
                    "type": "MUSHRA",
                    "reference":
                    {"sample_id": "ref", "asset_path": "file_sample_5.mp3"},
                    "question": None,
                    "anchors": [
                        {"sample_id": "a1", "asset_path": "file_sample_700.mp3"},
                        {"sample_id": "a2", "asset_path": "file_sample_5.mp3"}
                    ],
                    "samples": [
                        {"sample_id": "s1", "asset_path": "sample-12s.mp3"},
                        {"sample_id": "s2", "asset_path": "sample-15s.mp3"},
                        {"sample_id": "s3", "asset_path": "sample-12s.mp3"},
                        {"sample_id": "s4", "asset_path": "sample-15s.mp3"},
                        {"sample_id": "s5", "asset_path": "sample-12s.mp3"},
                        {"sample_id": "s6", "asset_path": "sample-15s.mp3"}
                    ]
                }
            ]
        },
        {
            "results": [
                {
                    "testNumber": 4,
                    "anchorsScores": [
                        {"sampleId": "a1", "score": 33},
                        {"sampleId": "a2", "score": 74}
                    ],
                    "referenceScore": 71,
                    "samplesScores": [
                        {"sampleId": "s1", "score": 28},
                        {"sampleId": "s2", "score": 37},
                        {"sampleId": "s3", "score": 29},
                        {"sampleId": "s4", "score": 30},
                        {"sampleId": "s5", "score": 78},
                        {"sampleId": "s6", "score": 82}
                    ]
                }
            ]
        },
        PqTestMUSHRAResult
    )
])
def test_add_experiment_results(session, create_experiment, upload_config, config_data, test_result, expected_result_type):
    experiment_name = "Test Experiment"
    create_experiment(experiment_name)
    upload_config(experiment_name, config_data)
    added_test_results = add_experiment_result(session, experiment_name, test_result)
    assert isinstance(added_test_results, PqTestResultsList)
    assert isinstance(added_test_results.results[0], expected_result_type)


def test_update_experiment_config(session, create_experiment, upload_config, experiment_data, updated_experiment_data):
    experiment_name = "Test Experiment"
    create_experiment(experiment_name)
    upload_config(experiment_name, experiment_data)
    experiment = get_experiment_by_name(session, experiment_name)
    assert experiment.name == experiment_data["name"]
    assert experiment.description == experiment_data["description"]
    assert len(experiment.tests) == 1
    assert experiment.tests[0].test_number == experiment_data["tests"][0]["test_number"]
    
    upload_config(experiment_name, updated_experiment_data)
    updated_experiment = get_experiment_by_name(session, experiment_name)
    assert updated_experiment.name == updated_experiment_data["name"]
    assert updated_experiment.description == updated_experiment_data["description"]
    assert len(updated_experiment.tests) == 2
    assert updated_experiment.tests[1].test_number == updated_experiment_data["tests"][1]["test_number"]



@pytest.mark.parametrize("config_data, test_result, expected_error", [
    (
        # Invalid field name in result
        {
            "name": "Full Experiment Name",
            "description": "Experiment Description",
            "end_text": "Experiment End Text",
            "tests": [
                {
                    "test_number": 1,
                    "type": "AB",
                    "samples": [
                        {"sample_id": "s1", "asset_path": "file_sample_5.mp3"},
                        {"sample_id": "s2", "asset_path": "file_sample_700.mp3"}
                    ],
                    "questions": [
                        {"question_id": "q1", "text": "Select better quality"},
                        {"question_id": "q2", "text": "Select more warmth"}
                    ]
                }
            ]
        },
        {
            "results": [
                {
                    "testNumber": 1,
                    "wrongField": [
                        {"questionId": "q1", "sampleId": "s1"},
                        {"questionId": "q2", "sampleId": "s2"}
                    ]
                }
            ]
        },
        IncorectInputData

    ),
    (
        # Missing required field in result
        {
            "name": "Full Experiment Name",
            "description": "Experiment Description",
            "end_text": "Experiment End Text",
            "tests": [
                {
                    "test_number": 1,
                    "type": "ABX",
                    "samples": [
                        {"sample_id": "s1", "asset_path": "file_sample_5.mp3"},
                        {"sample_id": "s2", "asset_path": "file_sample_700.mp3"}
                    ],
                    "questions": [
                        {"question_id": "q1", "text": "Select better quality"},
                        {"question_id": "q2", "text": "Select more warmth"}
                    ],
                    "x_sample_id": None
                }
            ]
        },
        {
            "results": [
                {
                    "testNumber": 1,
                    "selections": [
                        {"questionId": "q1", "sampleId": "s1"},
                        {"questionId": "q2", "sampleId": "s2"}
                    ]
                }
            ]
        },
        IncorectInputData
    )
])
def test_add_experiment_results_invalid(session, create_experiment, upload_config, config_data, test_result, expected_error):
    experiment_name = "Test Experiment"
    create_experiment(experiment_name)
    upload_config(experiment_name, config_data)
    
    with pytest.raises(expected_error):
        add_experiment_result(session, experiment_name, test_result)
