# PQ TOOLKIT API BACKEND

## API Docs

Swagger API docs are available at `localhost:8000/api/docs`

## Technology stack

- FastAPI
- PostgreSQL database
- Alembic migrations
- Swagger api docs
- sqlmodel orm
- ruff linter

## Setting up environment

Requires Python 3.11 and the poetry tool.

```bash
poetry install
```

## Usage

```bash
make <command>
```

Available commands:

- `test` - run tests
- `lint` - run linter
- `format` - run formatter
