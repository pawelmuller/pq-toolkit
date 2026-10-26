# API Client Walkthrough

## Creation of the API client
All the communication with the backend is organised by the API Client.

This is how to create its instance:

```{ .py .copy }
from pqtoolkit import PqToolkitAPIClient


api_client = PqToolkitAPIClient()
```

!!! warning

    Initiating the API client will test whether the given host and port are correct.

!!! tip

    You can also pass the username and password in the constructor to be immediatelly logged in, otherwise you need to call the `log_in` method to use restricted endpoints


## Creating new experiment
Experiments are the basic elements allowing to perform tests.

You can create one the following way: 

```{ .py .copy }
from pqtoolkit import PqToolkitAPIClient


api_client = PqToolkitAPIClient()
api_client.log_in('my username', 'my password')
experiments = api_client.create_experiment(experiment_name="Your_fancy_experiment_name")
```


## Setting up an experiment
Setting up an experiment is quite easy.

You need to create the appropriate setup class, depending on which test you want to perform:

=== "AB"

    ```{ .py .copy }
    from pqtoolkit.dataclasses import PqExperiment, PqTestAB, PqSample, PqQuestion


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
    from pqtoolkit.dataclasses import PqExperiment, PqTestABX, PqSample, PqQuestion


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
    from pqtoolkit.dataclasses import PqExperiment, PqTestAPE, PqSample, PqQuestion


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
    from pqtoolkit.dataclasses import PqExperiment, PqTestMUSHRA, PqSample


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
    from pqtoolkit.dataclasses import PqExperiment, PqTestAB, PqTestMUSHRA  # and other


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
from pqtoolkit import PqToolkitAPIClient


api_client = PqToolkitAPIClient(login='my login', password='my password')
api_client.setup_experiment(
    experiment_name="Your_fancy_experiment_name", 
    experiment_setup=experiment_setup)
```

!!! danger
    Be cautious!

    Using `api_client.setup_experiment()` method on an already configured experiment will overrite the old configuration.



## Uploading samples as a file
Once you configured an experiment you should proceed to uploading samples, so the test could serve them to UI.

```{ .py .copy }
from pqtoolkit import PqToolkitAPIClient


api_client = PqToolkitAPIClient(login='my login', password='my password')
sample_path = "./file_sample_5.mp3"
with open(sample_path, 'rb') as file:
    api_client.upload_sample(experiment_name="Your_fancy_experiment_name", sample_name="file_sample_5.mp3", sample_binary=file)
```

!!! danger
    Be cautious!

    Using `api_client.upload_sample()` method on an experiment will overrite already existing sample if their names match.


## Getting the list of all available experiments
This method will allow you to obtain all experiments' names, so you can fetch them later individually.

```{ .py .copy }
from pqtoolkit import PqToolkitAPIClient


api_client = PqToolkitAPIClient()
experiments = api_client.get_experiments()
```


## Getting experiment details by name
You can fetch detailed information about given experiment like this:

```{ .py .copy }
from pqtoolkit import PqToolkitAPIClient


api_client = PqToolkitAPIClient()
experiment = api_client.get_experiment(experiment_name="Your_fancy_experiment_name")
```


## Getting experiment results list
Like in experiments, you can get all experiment's results list to be able to fetch one's answers later on.
```{ .py .copy }
from pqtoolkit import PqToolkitAPIClient


api_client = PqToolkitAPIClient(login='my login', password='my password')
experiment_results = api_client.get_experiment_results(experiment_name="Your_fancy_experiment_name")
```


## Getting detailed experiment results
This is how you obtain answers from a result:

```{ .py .copy }
from pqtoolkit import PqToolkitAPIClient


api_client = PqToolkitAPIClient(login='my login', password='my password')
experiment_result = api_client.get_experiment_test_results(
    experiment_name=experiment_name,
    result_name="Some result name"  # Use get_experiment_results() to get available results
)
```


## Deleting the experiment
When you're done testing you can remove the experiment from the platform like this:

```{ .py .copy }
from pqtoolkit import PqToolkitAPIClient


api_client = PqToolkitAPIClient(login='my login', password='my password')
experiments = api_client.delete_experiment(experiment_name="Your_fancy_experiment_name")
)
```