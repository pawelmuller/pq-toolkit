# PQ-Toolkit Python interface

## Setting up environment

Requires Python 3.11 and the poetry tool.

```bash
cd src/pq-toolkit
poetry install
```

## Usage

### Development

```bash
make <command>
```

Available commands:

- `test-dry` - run dry tests (without the need of a working server)
- `test-all` - run all tests
- `lint` - run linter
- `format` - run formatter

### Production

Build wheel package

```bash
poetry build
```

Install wheel package

```bash
pip install dist/pq_toolkit-0.1.0-py3-none-any.whl
```
