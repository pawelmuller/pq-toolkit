# Troubleshooting

Below is a list of common issues that may occur during the startup of the toolkit, along with suggested solutions.

## Docker compose error
```bash
docker compose -f deployments/docker-compose.yml --env-file deployments/.env.dev build
unknown shorthand flag: 'f' in -f
```
Stage: `make build-[flavor]`

Reason: wrong docker compose version installed

Solution: upgrade docker compose to **v2** or change `deployments/Makefile` syntax to v1 by switching every:
```sh
docker compose
```
to
```sh
docker-compose
```

## Dev Dockerfile error
```bash
Step 3/9 : COPY package*.json .
When using COPY with more than one source file, the destination must be a directory and end with a /
ERROR: Service 'pq-toolkit-ui-dev' failed to build : Build failed
make: *** [Makefile:3: build-dev] Error 1
```
Stage: `make build-dev`

Reason: while using wildcard like `package*.json` Docker requires the destination to be a folder and to end with a `/`.

Solution: add `/` in the command from the error message in `src/pq-toolkit-ui/Dockerfile.dev` so it looks like that:
```sh
COPY package*.json ./
```

## Application start-up error (Windows only)
```bash
/usr/bin/env: 'bash\r': No such file or directory
/usr/bin/env: use -[v]S to pass options in shebang lines
```
Stage: `make start-dev` on Windows OS

Reason: in `prestart.sh` there tends to be a problem with file encoding, therefore `\r` sign is artificially added at the end of the `#! /usr/bin/env bash` line.

Solution: ensure that there is no `\r` sign at the end of the line (easiest way is to simply delete the sign).
