# 24L ZPRP Design proposal - team 8

## Goal

Continuation of the project [Perceptual Qualities Toolkit](https://github.com/pawelmuller/pq-toolkit)

## Schedule

| Week   |      Scope of work      |
|----------:|:-------------|
| W1 18.03 - 24.03  | Getting to know the project structure, domain knowledge and API specification |
| W2 25.04 - 31.03  | Division of the UI and backend into separate containers, creation of a database model |
| W3 1.04 - 7.04    | Backend development in Flask, initial database implementation |
| W4 8.04 - 14.04   | Working database and crud operations, initial UI mockup (Working application prototype) |
| W5 15.04 - 21.04  | Finalization of CRUD and API operations |
| W6 22.04 - 28.04  | Implementation of authorization for the administration panel and API keys |
| W7 29.04 - 5.05   | Finalizing UI |
| W8 6.05 - 12.05   | Implementation of tests and documentation |
| W9 13.05 - 19.05  | Spare date in case of delays |
| W10+ 20.05 - End of semester | Project evaluation and possible corrections |

## Planned development of the application

### Plan

- changing the operation of the backend (in accordance with good programming practices) while maintaining the API interface
- UI graphical improvements for a more pleasant use of the application
- adding a structured layer of durability

### Features

- UI:
  - ability to create configurations via UI
  - visual user interface
- data base:
  - storing test configurations, results and samples
  - separation of frontend and backend into separate containers
- authorization:
  - logging in when accessing the administration panel
  - generating API keys for the Python client

## Technology stack

- Docker + Docker compose
- NextJS (UI) - continuation
- Flask (back-end) (possible continuation in NextJS)
- PostgreSQL (data base)

Additions:

- Prettier
- Jest
- flake8
- venv
- make
- mkdocs
