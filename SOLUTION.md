# Yape Code Challenge Solution :rocket:

This repository contains a solution to Yape's code challenge. This solution was implemented by Gedy Palomino using a monorepo structure with pnpm workspaces.

## Features

- Flow: Transaction - Anti-fraud microservice - Transaction Status Update
- Event-based architecture using Kafka
- Technology stack: Node.js, Koa, PostgreSQL (Drizzle ORM), Kafka
- Resources for creating and retrieving transactions


## Solution Structure

The solution is organized as follows:

```
.
├── gateway (API/Event Gateway)
│   ├── src
│       ├── config.ts (general microservices configuration)
│       ├── index.ts (entry point)
│       ├── kafka.ts (Kafka proxy setup)
│       ├── koa.ts (Koa [HTTP] proxy setup)
│       └── migration.ts (database migrations on startup)
│
├── libs (shared libraries)
│   ├── http
│   │   └── src
│   │       └── index.ts (HTTP library - for dev purposes)
│   └── shared
│       └── src
│           ├── errors.ts (shared errors)
│           ├── events.ts (shared EventManager class)
│           ├── index.ts
│           └── types.ts (shared types)
│
└── services (Microservices)
    ├── antifraud-ms (Anti-fraud microservice)
    │   └── src
    │       ├── controller (API controllers)
    |       |   └── __tests__
    │       ├── domain (domain logic)
    │       ├── handler (event handlers)
    │       └── service (business logic)
    |           └── __tests__
    └── transactions-ms (Transactions microservice)
        └── src
            ├── controller (API controllers)
            |   └── __tests__
            ├── domain (domain logic)
            |   └── __tests__
            ├── handler (event handlers)
            ├── repository (database access layer)
            |   └── __tests__
            └── service (business logic)
                └── __tests__
```

## Usage

### Commands

Use the following commands to work with the code challenge solution:

```bash
# Development mode, uses `gateway` workspace
pnpm dev

# Watch mode for continuous development, uses `gateway` workspace
pnpm dev:watch

# Build shared libraries, services, and the gateway
pnpm build

# Start the application after building it
pnpm start

# Generate services templates
pnpm generate

# Run tests
pnpm test

# Generate code coverage
pnpm coverage
```

### Prerequisites

- Node.js
- Docker
- pnpm

## Decisions Made

1. Used **pnpm** and **pnpm workspaces** for a monorepo structure.
2. Applied an **event-based architecture** using Kafka.
3. Implemented **microservices** for the transaction and anti-fraud processes.
4. Created **shared libraries** for handling common functionality.
5. Used **Koa** for the gateway.

## Environment Variables

This solution requires the following environment variables to function correctly. For development, you can set them in an `.env` file located in the root directory of the following workspaces.

- `./gateway/.env`
- `./services/antifraud-ms/.env`
- `./services/transactions-ms/.env`

```ini
KAFKA_BROKERS=localhost:9092
POSTGRES_STRING=postgres://postgres:postgres@localhost:5432/postgres
PROXY_HOST=localhost
```

- `KAFKA_BROKERS`: The address of your Kafka brokers.
- `POSTGRES_STRING`: A connection string for your PostgreSQL database.
- `PROXY_HOST`: The address of your proxy host.

### Script Example

To set the required environment variables when running the application, you can use the following script:

```bash
export KAFKA_BROKERS=localhost:9092
export POSTGRES_STRING=postgres://postgres:postgres@localhost:5432/postgres
export PROXY_HOST=localhost

# Run the application with the defined environment variables:
pnpm start
```

Remember to replace the values for the environment variables with your own configuration if needed.