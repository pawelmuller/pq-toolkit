from api_client import PqToolkitAPIClient
from api_client.dataclasses import PqExperiment, PqTest, PqTestTypes, PqSample, PqQuestion
from test_utils import generate_random_experiment_name

if __name__ == "__main__":
    # Creation of the API client
    api_client = PqToolkitAPIClient()

    # Creating new experiment
    experiment_name = generate_random_experiment_name()
    experiments = api_client.create_experiment(experiment_name=experiment_name)

    # Setting up an AB experiment
    experiment_setup = PqExperiment(
        name="Test 1",
        description="Some test suite",
        tests=[
            PqTest(
                test_number=1,
                type=PqTestTypes.AB,
                samples=[
                    PqSample(sample_id="s1", asset_path="file_sample_5.mp3"),
                    PqSample(sample_id="s2", asset_path="file_sample_700.mp3")
                ],
                questions=[
                    PqQuestion(question_id="q1", text="Select better quality"),
                    PqQuestion(question_id="q2", text="Select more warmth")
                ]
            )
        ]
    )
    api_client.setup_experiment(experiment_name=experiment_name, experiment_setup=experiment_setup)

    # Getting the list of all available experiments
    experiments = api_client.get_experiments()

    # Getting experiment details by name
    experiment = api_client.get_experiment(experiment_name=experiment_name)

    # Getting experiment results list
    experiment_results = api_client.get_experiment_results(experiment_name=experiment_name)

    # Getting detailed experiment results
    experiment_result = api_client.get_experiment_test_results(
        experiment_name=experiment_name,
        result_name=experiment_results[0]
    )
