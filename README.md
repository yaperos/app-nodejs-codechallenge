# App Node.js Code Challenge

This repository provides a minimal infrastructure scaffold and helper configuration to run the common services required for the challenge: PostgreSQL (with init SQL), Kafka/Zookeeper, Redis, and a Kafka UI. It also includes Docker support to run three Node services: BFF, Transactions MS, and Anti‑Fraud MS.

The README explains how to configure the environment and bring the stack up using Docker Compose.


## Table of Contents
- Overview
- Prerequisites
- Infrastructure Bootstrapping Guide (IMPORTANT)
- Environment Configuration
- Services and Ports
- Bring the stack up
- Useful commands
- Troubleshooting
- License


## Overview
- Database: PostgreSQL with an initialization script (db_init/ddl.sql) that creates tables, roles and a database user.
- Messaging: Kafka (with Zookeeper) and Kafka UI for inspection.
- Cache: Redis.
- Orchestration: Docker Compose (docker-compose.yml) with an env-file (compose.env).
- Application services: BFF, Transactions microservice, Anti‑Fraud microservice (Dockerized with Dockerfile.server).

The repository includes an example env-file (compose.env.example) that you will copy and adapt locally.


## Prerequisites
- Docker and Docker Compose installed
- A database password to use for the application DB user, or use the default configured in ddl.sql


## Infrastructure Bootstrapping Guide (IMPORTANT)
Before you bring up the stack, align credentials between the database initialization script and your environment variables.

1) Understand the default DB app user and password
   - The init script creates the app user app_usr_transactions_dev.
   - Default password in db_init/ddl.sql is currently 'secret'. You can keep it for local dev, or change it.

2) (Optional) Change the DB app user password in db_init/ddl.sql
   - File: db_init/ddl.sql
   - Find the block that creates the user:
       CREATE USER app_usr_transactions_dev WITH PASSWORD 'secret';
   - If you change 'secret' to another password, ensure you also update your services .env files accordingly (see step 4).

3) Create your compose.env file from the example
   - Copy the example file:
       cp compose.env.example compose.env
   - Open compose.env and set values as needed. In particular, ensure POSTGRES_PASSWORD is set to the PostgreSQL superuser/admin password you want Docker to use on first run. Keep it safe.

4) Make sure your microservices .env files use the same DB app user password
   - In each microservice .env (e.g., yape-ms-transactions/.env, yape-ms-anti-fraud/.env, yape-svc-bff/.env), set DB_PASSWORD to the exact same value configured for app_usr_transactions_dev in db_init/ddl.sql (default: secret).
   - Example (.env):
       DB_PASSWORD=secret

Note: If you changed the default password in step 2, use that new value instead of secret.


## Environment Configuration
- compose.env: Runtime variables for Docker Compose. Create it based on compose.env.example.
  - PostgreSQL:
    - POSTGRES_PORT: External port exposed by PostgreSQL container (e.g., 5440)
    - POSTGRES_USER: Admin user for the container (e.g., transactions_admin)
    - POSTGRES_PASSWORD: Admin user password for the container
    - POSTGRES_DB: Database name (e.g., yape-ms-transactions-dev)
  - Zookeeper/Kafka: External ports configuration
  - Redis: External port configuration

- .env (per microservice directory):
  - DB_HOST: Database host (service name in docker-compose, e.g., yape-db)
  - DB_PORT: Database port (container’s internal port 5432 or the exposed port if connecting from host)
  - DB_USER: app_usr_transactions_dev
  - DB_PASSWORD: Must match the password set in db_init/ddl.sql (default: secret)
  - DB_NAME: yape-ms-transactions-dev
  - KAFKA_URL: kafka:29092 (from inside the Docker network) or localhost:9092 (from host)


## Services and Ports
Defined in docker-compose.yml:
- postgres (yape-db): ${POSTGRES_PORT}:5432 (default 5440->5432)
- zookeeper: 2181:2181
- kafka: ${KAFKA_EXTERNAL_PORT}:9092 (default 9092->9092). Internal listener at kafka:29092
- kafka-ui: 8080:8080 (browse http://localhost:8080)
- redis (yape-redis): ${REDIS_EXTERNAL_PORT}:6379 (example 6380->6379)
- bff (yape-svc-bff): 6001:3000
- ms-transactions (yape-ms-transactions): 6002:3000
- ms-anti-fraud (yape-ms-anti-fraud): 6003:3000

Note: The Node services expect their respective .env files under their folders (env_file in compose points to each .env).


## Bring the stack up
After completing the Bootstrapping Guide steps:

- With Docker Compose:
  docker compose --env-file ./compose.env up -d

This will start PostgreSQL, Zookeeper, Kafka, Kafka UI, Redis, and the three Node services using the environment defined in compose.env and the per-service .env files.

To stop the stack:
  docker compose down


## Useful commands
- Check running services:
  docker compose ps

- View logs for a specific service (e.g., PostgreSQL):
  docker compose logs -f yape-db

- View logs for a Node service (e.g., transactions):
  docker compose logs -f yape-ms-transactions

- Access Kafka UI:
  http://localhost:8080


## Troubleshooting
- Authentication failed for user app_usr_transactions_dev:
  - Ensure DB_PASSWORD in your service .env matches the password configured in db_init/ddl.sql (default: secret) before the first run.
  - If you changed the password after the DB volume was created, remove/recreate the volume or run docker compose down -v to reset.

- Ports already in use:
  - Adjust port values in compose.env (e.g., POSTGRES_PORT, KAFKA_EXTERNAL_PORT, REDIS_EXTERNAL_PORT) to free ports, then re-run.

- Database objects not present after first run:
  - Ensure the db_init/ddl.sql is being executed. If you started the stack before adjusting settings, you may need to recreate the database volume and start again.


## License
This project is provided as part of a coding challenge. Unless otherwise noted, no specific license is granted.
