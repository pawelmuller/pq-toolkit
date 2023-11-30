# pq-toolkit-ui

## Development:

- Running development server:
```bash
npm run dev
```

- generating json schema for experiment setup (must be run after changing setup object definition to ensure correct data validation)
```bash
ts-json-schema-generator --path ./src/utils/schemas/experimentSetup.ts --type ExperimentSetup -o ./src/utils/schemas/experiment-setup.schema.json
```

## Deployment

### Requirements

- Docker
- Make

### Development environment

```
make build-dev
make start-dev
```

Open http://localhost

### Staging environment

```
make build-stage
make start-stage
```

Open http://localhost

### Production environment

```
make build-prod
make start-prod
```

Open http://localhost
