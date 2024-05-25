import pytest
from sqlmodel import Session, select
from app.crud import (
    get_experiments,
    get_experiment_by_name,
    add_experiment,
    remove_experiment_by_name,
    upload_experiment_config,
    add_experiment_result,
    ExperimentNotFound,
    ExperimentAlreadyExists,
    ExperimentNotConfigured,
    ExperimentAlreadyConfigured,
    NoTestsFoundForExperiment,
    NoResultsData,
    NoMatchingTest,
)
from app.models import Experiment, Test, ExperimentTestResult
from app.schemas import PqTestResultsList, PqTestABResult, PqTestAPEResult, PqTestABXResult, PqSelection
from fastapi import UploadFile
from io import BytesIO
import json

def test_add_experiment(session):
    experiment_name = "Test Experiment"
    add_experiment(session, experiment_name)
    experiment = session.exec(select(Experiment).where(Experiment.name == experiment_name)).one()
    assert experiment.name == experiment_name

def test_add_experiment_already_exists(session):
    experiment_name = "Test Experiment"
    add_experiment(session, experiment_name)
    with pytest.raises(ExperimentAlreadyExists):
        add_experiment(session, experiment_name)

def test_get_experiment_no_configurated(session):
    experiment_name = "Test Experiment"
    add_experiment(session, experiment_name)
    with pytest.raises(ExperimentNotConfigured):
        get_experiment_by_name(session, experiment_name)


def test_get_experiment_by_name_not_found(session):
    with pytest.raises(ExperimentNotFound):
        get_experiment_by_name(session, "Nonexistent Experiment")


def test_upload_experiment_config(session):
    experiment_name = "Test Experiment"
    add_experiment(session, experiment_name)
    
    config_data = {
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
    json_file = UploadFile(filename="config.json", file=BytesIO(json.dumps(config_data).encode()))
    
    upload_experiment_config(session, experiment_name, json_file)
    experiment = get_experiment_by_name(session, experiment_name)
    assert experiment.name == config_data["name"]
    assert experiment.description == config_data["description"]
    assert len(experiment.tests) == 1
    assert experiment.tests[0].test_number == config_data["tests"][0]["test_number"]


def test_remove_experiment_by_name(session):
    experiment_name = "Test Experiment"
    add_experiment(session, experiment_name)
    config_data = {
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
    json_file = UploadFile(filename="config.json", file=BytesIO(json.dumps(config_data).encode()))
    
    upload_experiment_config(session, experiment_name, json_file)

    experiment = get_experiment_by_name(session, experiment_name)
    assert experiment.name == "Full Experiment Name"
    remove_experiment_by_name(session, experiment_name)
    with pytest.raises(ExperimentNotFound):
        get_experiment_by_name(session, experiment_name)


def test_add_experiment_results_AB(session):
    experiment_name = "Test Experiment"
    add_experiment(session, experiment_name)
    
    config_data = {
        "name": "Full Experiment Name",
        "description": "Experiment Description",
        "end_text": "Experiment End Text",
        "tests": [
            {
                "test_number": 1,
                "type": "AB",
                "samples": [{"sample_id": "s1", "asset_path": "file_sample_5.mp3"},
                            {"sample_id": "s2", "asset_path": "file_sample_700.mp3"}],
                "questions": [{"question_id": "q1", "text": "Select better quality"},
                              {"question_id": "q2", "text": "Select more warmth"}]
            }
        ]
    }
    json_file = UploadFile(filename="config.json", file=BytesIO(json.dumps(config_data).encode()))
    
    upload_experiment_config(session, experiment_name, json_file)

    test_result = {
        "results":[{
        "testNumber": 1,
        "selections": [
            {"questionId": "q1", "sampleId": "s1"},
            {"questionId": "q2", "sampleId": "s2"}]
            }]
        }

    added_test_reults = add_experiment_result(session, experiment_name, test_result)
    assert type(added_test_reults) == PqTestResultsList
    assert type(added_test_reults.results[0]) == PqTestABResult
    assert added_test_reults.results[0].test_number == 1
    assert added_test_reults.results[0].selections[0].question_id == 'q1'
    assert added_test_reults.results[0].selections[0].sample_id == 's1'
    assert added_test_reults.results[0].selections[1].question_id == 'q2'
    assert added_test_reults.results[0].selections[1].sample_id == 's2'



def test_add_experiment_results_ABX(session):
    experiment_name = "Test Experiment"
    add_experiment(session, experiment_name)
    
    config_data = {
        "name": "Full Experiment Name",
        "description": "Experiment Description",
        "end_text": "Experiment End Text",
        "tests": [{
            "x_sample_id": None,
            "test_number": 1,
            "type": "ABX",
            "samples": [
                {"sample_id": "s1", "asset_path": "file_sample_5.mp3"},
                {"sample_id": "s2", "asset_path": "file_sample_700.mp3"}],
            "questions": [
                {"question_id": "q1", "text": "Select better quality"},
                {"question_id": "q2", "text": "Select more warmth"}]
            }]
    }
    json_file = UploadFile(filename="config.json", file=BytesIO(json.dumps(config_data).encode()))
    
    upload_experiment_config(session, experiment_name, json_file)

    test_result = {
        "results":[{
            "testNumber": 1,
            "xSampleId": "s1",
            "xSelected": "s1",
            "selections": [
                {"questionId": "q1", "sampleId": "s2"},
                {"questionId": "q2", "sampleId": "s1"}]
            }]
        }

    added_test_reults = add_experiment_result(session, experiment_name, test_result)
    assert type(added_test_reults) == PqTestResultsList
    assert type(added_test_reults.results[0]) == PqTestABXResult
    assert added_test_reults.results[0].test_number == 1
    assert added_test_reults.results[0].selections[0].question_id == 'q1'
    assert added_test_reults.results[0].selections[0].sample_id == 's2'
    assert added_test_reults.results[0].selections[1].question_id == 'q2'
    assert added_test_reults.results[0].selections[1].sample_id == 's1'
    assert added_test_reults.results[0].x_sample_id == 's1'
    assert added_test_reults.results[0].x_selected == 's1'



def test_add_experiment_results_APE(session):
    experiment_name = "Test Experiment"
    add_experiment(session, experiment_name)
    
    config_data = {
        "name": "Full Experiment Name",
        "description": "Experiment Description",
        "end_text": "Experiment End Text",
        "tests": [{
            "test_number": 3,
            "type": "APE",
            "axis": [
                {"question_id": "a1", "text": "Quality"},
                {"question_id": "a2", "text": "Depth"}],
            "samples": [
                {"sample_id": "s1", "asset_path": "file_sample_5.mp3"},
                {"sample_id": "s2", "asset_path": "file_sample_700.mp3"},
                {"sample_id": "s3", "asset_path": "sample-12s.mp3"}
                ]
            }]
    }
    json_file = UploadFile(filename="config.json", file=BytesIO(json.dumps(config_data).encode()))
    
    upload_experiment_config(session, experiment_name, json_file)

    test_result = {
        "results":[{
            "testNumber": 3,
            "axisResults": [
                {
                "axisId": "a1",
                "sampleRatings": [
                    {"sampleId": "s1", "rating": 29},
                    {"sampleId": "s2", "rating": 64},
                    {"sampleId": "s3", "rating": 81}
                    ]},
                {
                "axisId": "a2",
                "sampleRatings": [
                    {"sampleId": "s1", "rating": 77},
                    {"sampleId": "s2", "rating": 38},
                    {"sampleId": "s3", "rating": 84}]}
            ]}]
        }

    added_test_reults = add_experiment_result(session, experiment_name, test_result)
    assert type(added_test_reults) == PqTestResultsList
    assert type(added_test_reults.results[0]) == PqTestAPEResult
    assert added_test_reults.results[0].test_number == 3
    assert added_test_reults.results[0].axis_results[0].axis_id == 'a1'
    assert added_test_reults.results[0].axis_results[1].axis_id == 'a2'
    assert added_test_reults.results[0].axis_results[0].sample_ratings[0].rating == 29
    assert added_test_reults.results[0].axis_results[0].sample_ratings[1].rating == 64
    assert added_test_reults.results[0].axis_results[0].sample_ratings[2].rating == 81
    assert added_test_reults.results[0].axis_results[0].sample_ratings[0].sample_id == 's1'
    assert added_test_reults.results[0].axis_results[0].sample_ratings[1].sample_id == 's2'
    assert added_test_reults.results[0].axis_results[0].sample_ratings[2].sample_id == 's3'
    assert added_test_reults.results[0].axis_results[1].sample_ratings[0].rating == 77
    assert added_test_reults.results[0].axis_results[1].sample_ratings[1].rating == 38
    assert added_test_reults.results[0].axis_results[1].sample_ratings[2].rating == 84
    assert added_test_reults.results[0].axis_results[1].sample_ratings[0].sample_id == 's1'
    assert added_test_reults.results[0].axis_results[1].sample_ratings[1].sample_id == 's2'
    assert added_test_reults.results[0].axis_results[1].sample_ratings[2].sample_id == 's3'