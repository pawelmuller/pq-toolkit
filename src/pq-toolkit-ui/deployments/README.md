# Deployments

Deployments are managed via `docker compose`. Base configuration (*dev*) is located in `docker-compose.yml`.
Other configurations are stored as overrides for base configuration (*stage* and *prod* environment).

## Building

```bash
docker compose -f deployments/docker-compose.yml build
```

or with env override

```bash
docker compose -f docker-compose.yml -f docker-compose.stage.yml build
```

## Starting containers

```bash
docker compose -f docker-compose.yml up -d
```

## Stopping containers

```bash
docker compose -f docker-compose.yml down
```
