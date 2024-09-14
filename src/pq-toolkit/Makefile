.PHONY: lint
lint:
	ruff check pqtoolkit examples tests
	ruff format pqtoolkit examples tests --check

.PHONY: format
format:
	ruff format pqtoolkit examples tests

.PHONY: test-dry
test-dry:
	python3 tests/test_dry/test_experiments.py

.PHONY: test-all
test-all:
	python3 tests/test_dry/test_experiments.py
	python3 tests/test_with_api/test_experiments.py
