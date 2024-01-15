from api_client import PqToolkitAPIClient
from api_client.dataclasses import PqExperiment, PqSample, PqQuestion, PqTestAB, PqTestMUSHRA
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
            PqTestAB(
                test_number=1,
                samples=[
                    PqSample(sample_id="s1", asset_path="file_sample_5.mp3"),
                    PqSample(sample_id="s2", asset_path="file_sample_700.mp3")
                ],
                questions=[
                    PqQuestion(question_id="q1", text="Select better quality"),
                    PqQuestion(question_id="q2", text="Select more warmth")
                ]
            ),
            PqTestMUSHRA(
                test_number=2,
                reference=PqSample(sample_id="ref", asset_path="file_sample_5.mp3"),
                anchors=[
                    PqSample(sample_id="a1", asset_path="file_sample_700.mp3"),
                    PqSample(sample_id="a2", asset_path="file_sample_5.mp3")
                ],
                samples=[
                    PqSample(sample_id="s1", asset_path="sample-12s.mp3"),
                    PqSample(sample_id="s2", asset_path="sample-15s.mp3"),
                    PqSample(sample_id="s3", asset_path="sample-12s.mp3"),
                    PqSample(sample_id="s4", asset_path="sample-15s.mp3"),
                    PqSample(sample_id="s5", asset_path="sample-12s.mp3"),
                    PqSample(sample_id="s6", asset_path="sample-15s.mp3")
                ]
            )
        ]
    )
    api_client.setup_experiment(experiment_name=experiment_name, experiment_setup=experiment_setup)

    # Uploading samples as a file
    sample_path = "file_sample_5.mp3"
    with open(sample_path, 'rb') as file:
        api_client.upload_sample(experiment_name=experiment_name, sample_name="file_sample_5.mp3", sample_binary=file)

    # Getting the list of all available experiments
    experiments = api_client.get_experiments()

    # Getting experiment details by name
    experiment = api_client.get_experiment(experiment_name=experiment_name)

    # The following will work ONLY if one takes the experiment through UI
    # Expect errors otherwise

    # Getting experiment results list
    experiment_results = api_client.get_experiment_results(experiment_name=experiment_name)

    # Getting detailed experiment results
    experiment_result = api_client.get_experiment_test_results(
        experiment_name=experiment_name,
        result_name=experiment_results[0]
    )

    experiments = api_client.delete_experiment(experiment_name=experiment_name)
