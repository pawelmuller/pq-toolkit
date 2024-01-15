# Getting started


## Creation of the API client
All the communication with the backend is organised by the API Client.

This is how to create its instance:

```python
from api_client import PqToolkitAPIClient


api_client = PqToolkitAPIClient()
```

!!! warning

    Initiating the API client will test whether the given host and port are correct.


## Creating new experiment
Experiments are the basic elements allowing to perform tests.

You can create one the following way: 

```python
from api_client import PqToolkitAPIClient


api_client = PqToolkitAPIClient()
experiments = api_client.create_experiment(experiment_name="Your fancy experiment name")
```


## Setting up an experiment
Setting up an experiment is quite easy.

You need to create the appropriate setup class, depending on which test you want to perform:

=== "AB"

    ```{ .py .copy }
    from api_client.dataclasses import PqExperiment, PqTestAB, PqSample, PqQuestion


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
            )
        ]
    )
    ```

=== "ABX"

    ```{ .py .copy }
    from api_client.dataclasses import PqExperiment, PqTestABX, PqSample, PqQuestion


    experiment_setup = PqExperiment(
        name="Test 1",
        description="Some test suite",
        tests=[
            PqTestABX(
                test_number=2,
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
    ```

=== "APE"

    ```{ .py .copy }
    from api_client.dataclasses import PqExperiment, PqTestAPE, PqSample, PqQuestion


    experiment_setup = PqExperiment(
        name="Test 1",
        description="Some test suite",
        tests=[
            PqTestAPE(
                test_number=3,
                samples=[
                    PqSample(sample_id="s1", asset_path="file_sample_5.mp3"),
                    PqSample(sample_id="s2", asset_path="file_sample_700.mp3"),
                    PqSample(sample_id="s3", asset_path="sample-12s.mp3")
                ],
                axis=[
                    PqQuestion(question_id="a1", text="Quality"),
                    PqQuestion(question_id="a2", text="Depth")
                ]
            )
        ]
    )
    ```

=== "MUSHRA"

    ```{ .py .copy }
    from api_client.dataclasses import PqExperiment, PqTestMUSHRA, PqSample


    experiment_setup = PqExperiment(
        name="Test 1",
        description="Some test suite",
        tests=[
            PqTestMUSHRA(
                test_number=4,
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
    ```

!!! tip
    You can create multiple tests per experiment at once! 

    When setting up an experiment:

    ```{ .py .copy }
    from api_client.dataclasses import PqExperiment, PqTestAB, PqTestMUSHRA  # and other


    experiment_setup = PqExperiment(
        name="Test 1",
        description="Some test suite",
        tests=[
            PqTestAB( ... ),
            PqTestAB( ... ),
            PqTestMUSHRA( ... ),
            PqTestMUSHRA( ... )  # and so on
        ]
    )
    ```

Having created the setup object, the only thing left is to upload the configuration to an experiment:

```{ .py .copy }
from api_client import PqToolkitAPIClient


api_client = PqToolkitAPIClient()
api_client.setup_experiment(
    experiment_name="Your fancy experiment name", 
    experiment_setup=experiment_setup)
```

!!! danger
    Be cautious!

    Using `api_client.setup_experiment()` method on an already configured experiment will overrite the old configuration.



## Uploading samples as a file
Once you configured an experiment you should proceed to uploading samples, so the test could serve them to UI.

```{ .py .copy }
from api_client import PqToolkitAPIClient


api_client = PqToolkitAPIClient()
sample_path = "./file_sample_5.mp3"
with open(sample_path, 'rb') as file:
    api_client.upload_sample(experiment_name="Your fancy experiment name", sample_name="file_sample_5.mp3", sample_binary=file)
```

!!! danger
    Be cautious!

    Using `api_client.upload_sample()` method on an experiment will overrite already existing sample if their names match.


## Getting the list of all available experiments

```{ .py .copy }
from api_client import PqToolkitAPIClient


api_client = PqToolkitAPIClient()
experiments = api_client.get_experiments()
```


## Getting experiment details by name

```{ .py .copy }
from api_client import PqToolkitAPIClient


api_client = PqToolkitAPIClient()
experiment = api_client.get_experiment(experiment_name="Your fancy experiment name")
```


## Getting experiment results list

```{ .py .copy }
from api_client import PqToolkitAPIClient


api_client = PqToolkitAPIClient()
experiment_results = api_client.get_experiment_results(experiment_name="Your fancy experiment name")
```


## Getting detailed experiment results


```{ .py .copy }
from api_client import PqToolkitAPIClient


api_client = PqToolkitAPIClient()
experiment_result = api_client.get_experiment_test_results(
    experiment_name=experiment_name,
    result_name="Some result name"  # Use get_experiment_results() to get available results
)
```


## Deleting the experiment


```{ .py .copy }
from api_client import PqToolkitAPIClient


api_client = PqToolkitAPIClient()
experiments = api_client.delete_experiment(experiment_name="Your fancy experiment name")
)
```
