# Web application

## Deployment
   - Go to `src/deployments/flavor/[flavor]`
   - Fill in required configuration in `.env` files according to your specification (or use the existing one)
   - Go to `src/`
   - Build docker image by running `make build-[flavor]`
   - Deploy docker image by running `make start-[flavor]`
   - To stop an image use `make stop-[flavor]`

## Available flavors
The `pq-toolkit` project four distinct Docker Compose environments ("flavors") that serve different purposes across development, testing, and database management workflows.

### `dev` – Development environment

Used for local development. Enables full access to code via mounted volumes, hot-reloading, and browser-based interaction with the application.

---

### `prod` – Production environment

Used for deploying the production version of the application. All services are containerized without local mounts, mimicking a real deployment scenario.

---

### `stage` – Staging environment

Used for testing pre-release versions in a near-production setup. Intended for QA verification, continuous integration pipelines, or internal previews.

---

### `alembic` – Database migration shell (N/A to Deployments)

Used exclusively for running Alembic-based database migrations and inspecting the backend in a shell. It does not include frontend or storage services.

---

### Environment comparison table

| Flavor   | Purpose                 | Web UI | Code via volume | Gateway | Frontend | Backend | MinIO | Adminer | Shell |
|----------|-------------------------|--------|------------------|---------|----------|---------|--------|----------|--------|
| `dev`    | Development              | ✅     | ✅               | ✅      | ✅       | ✅      | ✅     | ✅       | ❌     |
| `prod`   | Production deployment    | ❌     | ❌               | ✅      | ✅       | ✅      | ✅     | ✅       | ❌     |
| `stage`  | Testing / staging        | ❌     | ❌               | ✅      | ✅       | ✅      | ✅     | ✅       | ❌     |
| `alembic`| DB migrations / shell    | ❌     | ✅ (backend only) | ❌      | ❌       | ✅      | ❌     | ❌       | ✅     |


## Creating revisions
   - Go to `src/`
   - Run `make alembic-shell`
   - Execute alembic commands in the shell
   - Exit the shell
   - Run `make alembic-stop`

All the revisions are automatically applied at startup.