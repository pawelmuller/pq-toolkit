class PqToolkitException(Exception):
    def __init__(self, message="An exception occurred"):
        self.message = message
        super().__init__(self.message)
