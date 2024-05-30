FROM python:3.11-slim

RUN pip install poetry

WORKDIR /app/

ENV PYTHONPATH=/app
ARG ENVIRONMENT=production

COPY pyproject.toml poetry.lock ./

RUN POETRY_VIRTUALENVS_CREATE=false poetry install $(test "$ENVIRONMENT" == production && echo "--only=main") --no-interaction --no-ansi

COPY . .

RUN chmod +x prestart.sh

EXPOSE 8787
