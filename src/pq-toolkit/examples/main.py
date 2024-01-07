from api_client import PqToolkitAPIClient


if __name__ == "__main__":
    # Creation of the API client
    api_client = PqToolkitAPIClient()

    # Getting the list of all available experiments
    experiments = api_client.get_experiments()
    print(experiments)

    # Getting experiment details by name
    experiment = api_client.get_experiment(experiment_name=experiments[0])
    print(experiment)

    # Getting experiment results list
    experiment_results = api_client.get_experiment_results(experiment_name=experiments[0])
    print(experiment_results)

    # Getting detailed experiment results
    experiment_result = api_client.get_experiment_result(
        experiment_name=experiments[0],
        result_name=experiment_results[0]
    )
    print(experiment_result)
