import unittest

from api_client import PqToolkitAPIClient
from test_utils import generate_random_experiment_name


class TestExperimentsWithAPI(unittest.TestCase):
    def setUp(self):
        self.client = PqToolkitAPIClient()
        self.experiments_to_remove = []

    def tearDown(self):
        for experiment in self.experiments_to_remove:
            self.client.delete_experiment(experiment_name=experiment)

        api_experiments = self.client.get_experiments()
        for experiment in self.experiments_to_remove:
            self.assertNotIn(experiment, api_experiments)
            self.experiments_to_remove.remove(experiment)

    def test_create_experiment(self):
        experiment_name = generate_random_experiment_name()
        experiments = self.client.create_experiment(experiment_name=experiment_name)
        self.experiments_to_remove.append(experiment_name)
        self.assertIn(experiment_name, experiments)

    def test_delete_experiment(self):
        experiment_name = generate_random_experiment_name()
        experiments = self.client.create_experiment(experiment_name=experiment_name)
        self.experiments_to_remove.append(experiment_name)
        self.assertIn(experiment_name, experiments)

        experiments = self.client.delete_experiment(experiment_name=experiment_name)
        self.experiments_to_remove.append(experiment_name)
        self.assertNotIn(experiment_name, experiments)


if __name__ == '__main__':
    unittest.main()
