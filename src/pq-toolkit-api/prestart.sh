#! /usr/bin/env bash
# Let the DB start
python app/backend_pre_start.py

# Run migrations
if [ "$ENVIRONMENT" != "local" ]; then
    alembic upgrade head
fi

# Create initial data in DB
python app/initial_data.py
