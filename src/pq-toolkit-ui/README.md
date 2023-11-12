# pq-toolkit-ui

## Dev scripts:

- `npm run dev` - run application in dev mode
- `ts-json-schema-generator --path ./src/utils/schemas/experimentSetup.ts --type ExperimentSetup -o ./src/utils/schemas/experiment-setup.schema.json` - generate
  json schema for experiment setup (must be run after changing setup object definition to ensure correct
  data validation)
