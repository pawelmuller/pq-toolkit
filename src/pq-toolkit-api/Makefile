.PHONY: lint
lint:
	ruff check app tests
	ruff format app tests --check

.PHONY: format
format:
	ruff format app tests

.PHONY: test
test:
	pytest tests

.PHONY: alembic-shell
alembic-shell:
