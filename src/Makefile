.PHONY: build-dev
build-dev: ## Build the development docker image.
	docker compose -f deployments/docker-compose.yml --env-file deployments/.env.dev build

.PHONY: build-clean-dev
build-clean-dev: ## Build the development docker image without cache
	docker compose -f deployments/docker-compose.yml --env-file deployments/.env.dev build --no-cache

.PHONY: start-dev
start-dev: ## Start the development docker container.
	docker compose -f deployments/docker-compose.yml --env-file deployments/.env.dev up -d

.PHONY: start-dev-debug
start-dev-debug: ## Start the development docker container and attach
	docker compose -f deployments/docker-compose.yml --env-file deployments/.env.dev up

.PHONY: stop-dev
stop-dev: ## Stop the development docker container.
	docker compose -f deployments/docker-compose.yml --env-file deployments/.env.dev down

.PHONY: build-stage
build-stage: ## Build the staging docker image.
	docker compose -f deployments/docker-compose.stage.yml --env-file deployments/.env.stage build

.PHONY: build-clean-stage
build-clean-stage: ## Build the staging docker image.
	docker compose -f deployments/docker-compose.stage.yml --env-file deployments/.env.stage build --no-cache

.PHONY: start-stage
start-stage: ## Start the staging docker container.
	docker compose -f deployments/docker-compose.stage.yml --env-file deployments/.env.stage up -d

.PHONY: stop-stage
stop-stage: ## Stop the staging docker container.
	docker compose -f deployments/docker-compose.stage.yml --env-file deployments/.env.stage down
  
.PHONY: build-prod
build-prod: ## Build the production docker image.
	docker compose -f deployments/docker-compose.prod.yml --env-file deployments/.env.prod build

.PHONY: build-clean-prod
build-clean-prod: ## Build the production docker image.
	docker compose -f deployments/docker-compose.prod.yml --env-file deployments/.env.prod build

.PHONY: start-prod
start-prod: ## Start the production docker container.
	docker compose -f deployments/docker-compose.prod.yml --env-file deployments/.env.prod up -d

.PHONY: start-prod-debug
start-prod-debug: ## Start the production docker container.
	docker compose -f deployments/docker-compose.prod.yml --env-file deployments/.env.prod up

.PHONY: stop-prod
stop-prod: ## Stop the production docker container.
	docker compose -f deployments/docker-compose.prod.yml --env-file deployments/.env.prod down
