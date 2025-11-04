# Yape Reto - Transaction & Antifraud Microservices

This project consists of two microservices: Transaction Management and Antifraud Detection.

## Prerequisites

- Node.js (LTS version recommended)
- pnpm package manager
- Docker and Docker Compose

## Installation

### 1. Install Antifraud Microservice

```bash
cd antifraud-ms
pnpm install
```

### 2. Install Transaction Microservice

```bash
cd transaction-ms
pnpm install
```

### 3. Start Docker Services

From the root directory, start the required Docker containers:

```bash
docker-compose up -d
```

### 4. Configure Environment Variables

Copy the environment template file to create your local configuration:

```bash
cd transaction-ms
cp .env.template .env
```

## Running the Application

Start both microservices in development mode:

### Terminal 1 - Antifraud Microservice
```bash
cd antifraud-ms
pnpm run start:dev
```

### Terminal 2 - Transaction Microservice
```bash
cd transaction-ms
pnpm run start:dev
```

## Testing the API

Once both services are running, navigate to the GraphQL playground:

```
http://localhost:3000/graphql
```

### Available Operations

#### 1. Create Transaction Mutation

First, use this mutation to create a new transaction:

```graphql
mutation Mutation($createTransactionInput: CreateTransactionInput!) {
  createTransaction(createTransactionInput: $createTransactionInput) {
    accountExternalIdCredit
    accountExternalIdDebit
    createdAt
    status
    transactionExternalId
    value
  }
}
```

**Variables:**
```json
{
  "createTransactionInput": {
    "accountExternalIdDebit": "550e8400-e29b-41d4-a716-446655440000",
    "accountExternalIdCredit": "9f1a8a23-3c7b-4b9f-9e29-17d1f8e41e76",
    "value": 999,
    "transferTypeId": 1
  }
}
```

> **Note:** Copy the `transactionExternalId` from the response, you'll need it for the next query.

#### 2. Query Transaction

Use this query to retrieve the transaction details using the `transactionExternalId` obtained from the create mutation:

```graphql
query Transaction($transactionExternalId: String!) {
  transaction(transactionExternalId: $transactionExternalId) {
    status
    accountExternalIdCredit
    accountExternalIdDebit
    status
    transactionExternalId
  }
}
```

**Variables:**
```json
{
  "transactionExternalId": "<USE THE transactionExternalId FROM THE CREATE MUTATION RESPONSE>"
}
```

## Troubleshooting

- Ensure all Docker containers are running: `docker-compose ps`
- Check if ports 3000 and other required ports are available
- Verify environment variables are properly configured in `.env` file
- Check logs of each service for any errors

## Architecture

This project implements a microservices architecture with:
- **Transaction Microservice**: Handles transaction creation and management
- **Antifraud Microservice**: Validates transactions for fraud detection
- **GraphQL API**: Provides a unified interface for client interactions
