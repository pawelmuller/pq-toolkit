.PHONY: build-dev
build-dev: ## Build the development docker image.
	docker compose -f deployments/flavors/dev/docker-compose.yml --env-file deployments/flavors/dev/.env build

.PHONY: build-clean-dev
build-clean-dev: ## Build the development docker image without cache
	docker compose -f deployments/flavors/dev/docker-compose.yml --env-file deployments/flavors/dev/.env build --no-cache

.PHONY: start-dev
start-dev: ## Start the development docker container.
	docker compose -f deployments/flavors/dev/docker-compose.yml --env-file deployments/flavors/dev/.env up -d

.PHONY: start-dev-debug
start-dev-debug: ## Start the development docker container and attach
	docker compose -f deployments/flavors/dev/docker-compose.yml --env-file deployments/flavors/dev/.env up

.PHONY: stop-dev
stop-dev: ## Stop the development docker container.
	docker compose -f deployments/flavors/dev/docker-compose.yml --env-file deployments/flavors/dev/.env down

.PHONY: build-stage
build-stage: ## Build the staging docker image.
	docker compose -f deployments/flavors/stage/docker-compose.yml --env-file deployments/flavors/stage/.env build

.PHONY: build-clean-stage
build-clean-stage: ## Build the staging docker image.
	docker compose -f deployments/flavors/stage/docker-compose.yml --env-file deployments/flavors/stage/.env build --no-cache

.PHONY: start-stage
start-stage: ## Start the staging docker container.
	docker compose -f deployments/flavors/stage/docker-compose.yml --env-file deployments/flavors/stage/.env up -d

.PHONY: start-stage-debug
start-stage-debug: ## Start the development docker container and attach
	docker compose -f deployments/flavors/stage/docker-compose.yml --env-file deployments/flavors/stage/.env up

.PHONY: stop-stage
stop-stage: ## Stop the staging docker container.
	docker compose -f deployments/flavors/stage/docker-compose.yml --env-file deployments/flavors/stage/.env down

.PHONY: build-prod
build-prod: ## Build the production docker image.
	docker compose -f deployments/flavors/prod/docker-compose.yml --env-file deployments/flavors/prod/.env build

.PHONY: build-clean-prod
build-clean-prod: ## Build the production docker image.
	docker compose -f deployments/flavors/prod/docker-compose.yml --env-file deployments/flavors/prod/.env build

.PHONY: start-prod
start-prod: ## Start the production docker container.
	docker compose -f deployments/flavors/prod/docker-compose.yml --env-file deployments/flavors/prod/.env up -d

.PHONY: start-prod-debug
start-prod-debug: ## Start the production docker container.
	docker compose -f deployments/flavors/prod/docker-compose.yml --env-file deployments/flavors/prod/.env up

.PHONY: stop-prod
stop-prod: ## Stop the production docker container.
	docker compose -f deployments/flavors/prod/docker-compose.yml --env-file deployments/flavors/prod/.env down

.PHONY: alembic-shell
alembic-shell: ## Start the alembic shell
	docker compose -f deployments/flavors/alembic/docker-compose.yml --env-file deployments/flavors/alembic/.env run pq-toolkit-api-dev

.PHONY: alembic-stop
alembic-stop:
	docker compose -f deployments/flavors/alembic/docker-compose.yml --env-file deployments/flavors/alembic/.env down

