class PqToolkitException(Exception):
    def __init__(self, message: str = None):
        if not message:
            message = "An exception occurred"
        self.message = message


class PqSerializationException(PqToolkitException):
    def __init__(self, details: str = None):
        if details:
            message = f"Serialization exception: {details}"
        else:
            message = "A serialization exception occurred"
        self.message = message
        super().__init__(self.message)


class PqExperimentAlreadyExists(PqToolkitException):
    def __init__(self, experiment_name: str = None):
        if experiment_name:
            message = f"An experiment '{experiment_name}' already exists"
        else:
            message = f"An experiment already exists"
        self.message = message
        super().__init__(self.message)
