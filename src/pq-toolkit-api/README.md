# PQ TOOLKIT API BACKEND

## API Docs

Docs are available at `localhost:8000/api/docs` (at gateway) or `localhost:8787/docs` (at container)

## Technology stack

- FastAPI
- PostgreSQL
- Alembic

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
