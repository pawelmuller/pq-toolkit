from api_client import PqToolkitAPIClient


if __name__ == "__main__":
    api_client = PqToolkitAPIClient()
    # experiments = api_client.get_experiments()
    # print(experiments)

    experiment = api_client.get_experiment(name="Blablabla")
    print(experiment)
