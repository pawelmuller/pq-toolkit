class PqToolkitException(Exception):
    pass


class PqSerializationException(PqToolkitException):
    def __init__(self, details: str = None):
        if details:
            message = f"Serialization exception: {details}"
        else:
            message = "A serialization exception occurred"
        self.message = message
        super().__init__(self.message)


class PqValidationException(PqToolkitException):
    def __init__(self, details: str = None):
        if details:
            message = f"Validation exception: {details}"
        else:
            message = "A validation exception occurred"
        self.message = message
        super().__init__(self.message)


class PqExperimentAlreadyExistsException(PqToolkitException):
    def __init__(self, experiment_name: str = None):
        if experiment_name:
            message = f"An experiment '{experiment_name}' already exists"
        else:
            message = "An experiment already exists"
        self.message = message
        super().__init__(self.message)


class PqExperimentSetupException(PqToolkitException):
    def __init__(self, experiment_name: str, message: str = None):
        if message:
            _message = f"There was a problem setting up the experiment '{experiment_name}': {message}."
        else:
            _message = (
                f"There was a problem setting up the experiment '{experiment_name}'."
            )
        self.message = _message
        super().__init__(self.message)


class PqExperimentSampleUploadException(PqToolkitException):
    def __init__(self, experiment_name: str, sample_name: str, message: str = None):
        if message:
            _message = (
                f"There was a problem with uploading a sample '{sample_name}' "
                f"to an experiment '{experiment_name}': {message}."
            )
        else:
            _message = (
                f"There was a problem with uploading a sample '{sample_name}' "
                f"to an experiment '{experiment_name}'."
            )
        self.message = _message
        super().__init__(self.message)


class PqSampleNotFoundError(PqToolkitException):
    def __init__(self):
        super().__init__("Sample not found!")


class IncorrectLogin(PqToolkitException):
    def __init__(self) -> None:
        super().__init__("Incorrect login or password!")


class NotAuthorisedError(PqToolkitException):
    def __init__(self):
        super().__init__("Not authorized, log in first")


class DetailedError(PqToolkitException):
    def __init__(self, content):
        super().__init__(str(content))
