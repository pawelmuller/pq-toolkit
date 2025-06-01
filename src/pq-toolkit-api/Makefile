.PHONY: lint
lint:
	ruff check app tests
	ruff format app tests

.PHONY: format
format:
	ruff format app tests

.PHONY: test
test:
	pytest tests
