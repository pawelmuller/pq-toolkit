.PHONY: build-dev
build-dev: ## Build the development docker image.
	docker compose -f deployments/docker-compose.yml build

.PHONY: start-dev
start-dev: ## Start the development docker container.
	docker compose -f deployments/docker-compose.yml up -d

.PHONY: stop-dev
stop-dev: ## Stop the development docker container.
	docker compose -f deployments/docker-compose.yml down

.PHONY: build-stage
build-stage: ## Build the staging docker image.
	docker compose -f deployments/docker-compose.yml -f deployments/docker-compose.stage.yml build

.PHONY: start-stage
start-stage: ## Start the staging docker container.
	docker compose -f deployments/docker-compose.yml -f deployments/docker-compose.stage.yml up -d

.PHONY: stop-stage
stop-stage: ## Stop the staging docker container.
	docker compose -f deployments/docker-compose.yml -f deployments/docker-compose.stage.yml down
  
.PHONY: build-prod
build-prod: ## Build the production docker image.
	docker compose -f deployments/docker-compose.yml -f deployments/docker-compose.prod.yml build

.PHONY: start-prod
start-prod: ## Start the production docker container.
	docker compose -f deployments/docker-compose.yml -f deployments/docker-compose.prod.yml up -d

.PHONY: stop-prod
stop-prod: ## Stop the production docker container.
	docker compose -f deployments/docker-compose.yml -f deployments/docker-compose.prod.yml down
