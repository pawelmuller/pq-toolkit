import uuid


def generate_random_experiment_name() -> str:
    new_uuid = uuid.uuid4()
    return f"experiment_{new_uuid}"
