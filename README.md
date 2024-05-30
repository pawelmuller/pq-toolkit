# Perceptual Qualities Python Toolkit

Toolkit for preparing and conducting experiments that asses
perceptual qualities of audio.

## Project for course WIMU 23Z

Project members:
- Bartłomiej Piktel
- Paweł Müller
- Grzegorz Rusinek

### Contributions
 - ZPRP 24L course members:
   - Igor Matynia
   - Jakub Woźniak
   - Jan Kowalczewski
 - WIMU 24L course members:
   - Mikołaj Olczak
   - Kondracki Wojciech
   - Krzysztof Miśków

## Project structure

- docs - project documentation
- src - source files organised by modules
    - pq-toolkit - Python toolkit interface
    - pq-toolkit-ui - frontend for conducting experiments
    - pq-toolkit-api - backend service with api
    - deployments - docker compose and env files

## Usage

This project consists of test creation Python plugin and web application
testing platform.

### How to use Python plugin

Installation details are available in [pq-toolkit README](src/pq-toolkit/README.md), as well as in the [docs](docs/README.md).

The Python plugin can be used to interact with the PQ Toolkit API backend the same way as the web application and can also be used to read test results.

### How to start web application

1. Deployment:
   - Go to `src/deployments`
   - Fill in required configuration in `.env.*` files according to your specification
   - Go to `src/`
   - Build docker image by running `make build-[flavor]`
   - Deploy docker image by running `make start-[flavor]`
   - (To stop an image use `make stop-[flavor]`)
2. Uploading experiments
   - Using Python script
   - Using admin panel available at `/admin`
3. Verifying configuration using admin panel (`/admin/[experiment-name]`)
4. For users `/[experiment-name]`
5. Getting results using Python script

Available flavors:
- prod
- stage
- dev

### How to create revisions

1. Make sure you have `.env.prod` file in `src/deployments` directory
2. Go to `src/`
3. Run `make alembic-shell`
4. Execute alembic commands in the shell
5. Exit the shell
6. Run `make alembic-stop`

All the revisions are automatically applied at startup.

## 2024L notes

Initially, the project was planned for 3 people, but at the beginning we received information that it would be for 6 people, 3 people each from two different fields and subjects. This caused a slight disruption in the plans, but in order to control the situation as quickly as possible and minimize the number of problems, we decided to divide the work between backend - ZPRP group and fronted WIMU group. This allowed us to complete the project efficiently despite the large number of people involved.

Potential improvements:

## WIMU-24L notes (to change)

Changes regarding design proposal:
- xml files, xmlbuilder2 -> json files + zod validation

Known issues:
- Error handling
- Loading screen improvement (darkmode)

Potential improvements:
- authorization for admin endpoints/panel
- more options for test configurations (new tests or more helper components)
- separate backend for data handling, storage on larger scale (relational database)
- automatic mkdocs deployment
- dashboard in admin panel allowing to overview results
- eneble sample hearing in experiment configurator
- inbuilt experiment configuration creator (.json file)

## ZPRP-24L notes

Known issues:


The project progressed on schedule with minor delays while connecting the backend to the frontend. However, in the end, the project was completed only with a delay of a few days. Which is still before the deadline
