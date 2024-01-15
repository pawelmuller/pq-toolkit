import unittest

from api_client import PqToolkitAPIClient
from api_client.dataclasses import PqExperiment, PqTestAB, PqTestMUSHRA, PqSample, PqQuestion
from api_client.exceptions import PqExperimentSetupException
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

    def test_setup_experiment(self):
        experiment_name = generate_random_experiment_name()
        experiments = self.client.create_experiment(experiment_name=experiment_name)
        self.experiments_to_remove.append(experiment_name)
        self.assertIn(experiment_name, experiments)

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
        self.client.setup_experiment(experiment_name=experiment_name, experiment_setup=experiment_setup)

        experiment = self.client.get_experiment(experiment_name=experiment_name)
        assert experiment.model_dump(exclude={"uid"}) == experiment_setup.model_dump(exclude={"uid"})

    def test_setup_experiment_class_validation(self):
        experiment_name = generate_random_experiment_name()
        experiments = self.client.create_experiment(experiment_name=experiment_name)
        self.experiments_to_remove.append(experiment_name)
        self.assertIn(experiment_name, experiments)

        experiment_setup = "Not a PqExperiment"

        self.assertRaises(PqExperimentSetupException,
                          self.client.setup_experiment,
                          experiment_name=experiment_name,
                          experiment_setup=experiment_setup)


if __name__ == '__main__':
    unittest.main()
