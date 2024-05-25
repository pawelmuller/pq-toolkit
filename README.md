# Perceptual Qualities Python Toolkit

Toolkit for preparing and conducting experiments that asses
perceptual qualities of audio.

## Project for course WIMU 23Z

Project members:
- Bartłomiej Piktel
- Paweł Müller
- Grzegorz Rusinek

### Further developed by
 - ZPRP 24L course members:
   - Igor Matynia
   - Jakub Woźniak
   - Jan Kowalczewski
 - #TODO WIMU

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

### How to use Python plugin:
The project runs on [Python](https://www.python.org) 3.10+.

#### Installation

Firstly, you should obtain all project dependencies.
Consider using Python's [virtual environments](https://docs.python.org/3/tutorial/venv.html#virtual-environments-and-packages) to keep your installation nice and clean.

```bash
cd src/pq-toolkit
pip install -r requirements.txt
```

That's it! You're ready to go!

More detailed walkthrough can be found in project's docs directory.


### How to use testing web application:

1. Deployment:
   - Go to `src/deployments`
   - Fill in required configuration in `.env.*` files according to your specification
   - Build docker image by running `make build-[flavor]`
   - Deploy docker image by running `make start-[flavor]`
   - (To stop an image use `make stop-[flavor]`)
2. Uploading experiments
   - Using Python script
   - Using admin panel available at `/admin`
3. Verifying configuration using admin panel (`/admin/[experiment-name]`)
4. For users `/[experiment-name]`
5. Getting results using Python script

More information available in `src/pq-toolkit-ui/README.md`.

## WIMU notes

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

#TODO
