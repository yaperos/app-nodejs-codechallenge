# Challenge
## Overview

This solution was designed to handle high transaction volumes with a focus on performance, scalability, and resilience.

It consists of two microservices:

- **Transaction Service**: Handles creation and retrieval of transactions via gRPC.

- **Anti-Fraud Service**: Consumes transaction events, validates them, and updates their status asynchronously.

The architecture leverages:

- **gRPC + Protocol Buffers** - for efficient, high-performance communication between services.
- **Apache Kafka** - for event-driven, decoupled processing.
- **NestJS Framework** - for structured, scalable server-side Node.js development.
- **CQRS Pattern** - Separates read and write operations for optimized performance



## Tech Stack

- **Framework**: NestJS with TypeScript
- **API**: gRPC
- **Messaging**: Kafka
- **Database**: PostgreSQL with Prisma ORM
- **Node**: v20

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js v20
- npm

### Environment Setup
Each service (Transaction Service and Anti-Fraud Service) includes a .env.example file.

```shell
cp .env.example .env
```

### Starting the Services

1. Start Kafka and required infrastructure:
```shell
docker-compose up -d
```
Kafka will be exposed at localhost:9092.

2. Install dependencies and build each service:

```shell
npm install && npm run build
```

3. Run each service individually::
```shell
npm run start:prod
```

## Endpoints

- **Transaction Service**:
  - gRPC requests available at `grpc://localhost:3000/`
  - Health check available at `http://localhost:3001/`

- **Anti-Fraud Service**:
  - Health check available at `http://localhost:3005/`
  - Communicates internally via Kafka (no public gRPC endpoints)

## Making Request

The transaction service exposes a gRPC interface at `grpc://localhost:3000/`.

## Scaling Strategy

This architecture supports horizontal scaling:
- Multiple instances of each service can be deployed
- Kafka partitioning allows parallel processing of messages
- gRPC enables efficient, high-performance communication


## Future Improvements
- Add unit tests and integration tests for all services.
- Integrate Redis caching layer for frequently accessed transactions.
- Add comprehensive monitoring and alerting.
- Add read replicas for query optimization.
- Implement database sharding for extreme write volumes.