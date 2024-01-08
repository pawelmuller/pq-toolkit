import unittest
from unittest.mock import patch

from api_client import PqToolkitAPIClient


class TestExperiments(unittest.TestCase):
    @patch('requests.request')
    def setUp(self, mock_request):
        mock_response = unittest.mock.Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"status": "HEALTHY"}
        mock_request.return_value = mock_response

        self.client = PqToolkitAPIClient()

    @patch('requests.request')
    def test_get_no_experiments(self, mock_request):
        mock_response = unittest.mock.Mock()
        mock_response.status_code = 404
        mock_request.return_value = mock_response

        experiments = self.client.get_experiments()

        self.assertEqual(experiments, [])

    @patch('requests.request')
    def test_get_some_experiments(self, mock_request):
        mock_response = unittest.mock.Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"experiments": ["Blah blah blah", "Some experiment"]}
        mock_request.return_value = mock_response

        experiments = self.client.get_experiments()

        self.assertEqual(experiments, ["Blah blah blah", "Some experiment"])

    @patch('requests.request')
    def test_create_experiment(self, mock_request):
        mock_response = unittest.mock.Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"experiments": ["Blah experiment"]}
        mock_request.return_value = mock_response

        experiments = self.client.create_experiment(experiment_name="Blah experiment")

        self.assertEqual(experiments, {"experiments": ["Blah experiment"]})


if __name__ == '__main__':
    unittest.main()
