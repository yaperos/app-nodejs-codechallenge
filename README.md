# App Node.js Code Challenge

This repository contains a minimal infrastructure scaffold and helper scripts to run the common services required for the challenge (PostgreSQL, Kafka/Zookeeper, and Redis), plus database initialization SQL.

The README provides basic project information and an infrastructure bootstrapping guide you must follow before bringing the project up.


## Table of Contents
- Overview
- Prerequisites
- Infrastructure Bootstrapping Guide (IMPORTANT)
- Environment Configuration
- Bring the stack up
- Useful commands
- Troubleshooting
- License


## Overview
- Database: PostgreSQL with an initialization script (db_init/ddl.sql) that creates tables, roles and a database user.
- Messaging: Kafka (with Zookeeper).
- Cache: Redis.
- Orchestration: Docker Compose (docker-compose.yml) with an env-file (compose.env).

The repository includes an example env-file (compose.env.example) that you will copy and adapt locally.


## Prerequisites
- Docker and Docker Compose installed
- Bash/sh shell available to run the helper script (up.sh)
- A strong password to use for the database application user


## Infrastructure Bootstrapping Guide (IMPORTANT)
Before you bring up the stack, you must align credentials between the database initialization script and your environment variables.

1) Choose a strong password
   - Pick a strong password you want to use for the app database user (app_usr_transactions_dev).

2) Update db_init/ddl.sql with your chosen password
   - File: db_init/ddl.sql
   - Find the line that creates the user with a placeholder password:
     CREATE USER app_usr_transactions_dev WITH PASSWORD '<STRONG_PASSWORD>';
   - Replace <STRONG_PASSWORD> with your chosen strong password.
   - This password will be the one your services use to connect to the PostgreSQL database.

3) Create your compose.env file from the example
   - Copy the example file:
     cp compose.env.example compose.env
   - Open compose.env and set values as needed. In particular, ensure POSTGRES_PASSWORD is set to the PostgreSQL superuser/admin password you want Docker to use on first run (if your compose file makes use of it). Keep it safe.

4) Make sure your microservices .env use the same DB password
   - In each microservice .env, set DB_PASSWORD to the exact same password you put into db_init/ddl.sql in step 2.
   - Example (.env):
     DB_PASSWORD=<the_same_password_you_put_in_ddl.sql>

Note: In this repository, there is a sample .env at the root used by some services. Ensure DB_PASSWORD there matches the one you set in db_init/ddl.sql.


## Environment Configuration
- compose.env: Runtime variables for Docker Compose. Create it based on compose.env.example.
  - PostgreSQL:
    - POSTGRES_PORT: External port exposed by PostgreSQL container (e.g., 5440)
    - POSTGRES_USER: Admin user for the container (e.g., transactions_admin)
    - POSTGRES_PASSWORD: Admin user password for the container
    - POSTGRES_DB: Database name (e.g., yape-ms-transactions-dev)
  - Zookeeper/Kafka: External ports configuration
  - Redis: External port configuration

- .env (per microservice or at project root depending on your setup):
  - DB_HOST: Database host (e.g., yape-db if that’s the service name in docker-compose)
  - DB_PORT: Database port (must match your exposed/internal mapping, typically 5440 externally)
  - DB_USER: app_usr_transactions_dev
  - DB_PASSWORD: MUST MATCH the password you set in db_init/ddl.sql (see the guide above)
  - DB_NAME: yape-ms-transactions-dev


## Bring the stack up
After completing the Bootstrapping Guide steps:

- Using the helper script (recommended):
  ./up.sh

- Or with Docker Compose directly:
  docker compose --env-file ./compose.env up -d

This will start PostgreSQL, Zookeeper, Kafka, and Redis using the environment defined in compose.env.


## Useful commands
- Check running services:
  docker compose ps

- View logs for a specific service (e.g., PostgreSQL):
  docker compose logs -f yape-db

- Stop the stack:
  docker compose down


## Troubleshooting
- Authentication failed for user app_usr_transactions_dev:
  - Ensure you replaced <STRONG_PASSWORD> in db_init/ddl.sql with your chosen password before the first run.
  - Ensure DB_PASSWORD in your service .env is exactly the same password.

- Ports already in use:
  - Adjust port values in compose.env (e.g., POSTGRES_PORT, KAFKA_EXTERNAL_PORT, REDIS_EXTERNAL_PORT) to free ports, then re-run.

- Database objects not present after first run:
  - Ensure the db_init/ddl.sql is being executed by your setup. If you started the stack before editing the password, you may need to recreate the database volume and start again.


## License
This project is provided as part of a coding challenge. Unless otherwise noted, no specific license is granted.
