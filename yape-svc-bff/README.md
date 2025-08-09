<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# <p align="center"> Yape BFF service </p>

Backend For Frontend (BFF) built with NestJS that exposes a GraphQL API and orchestrates calls to a gRPC transactions microservice.

- Runtime: Node.js + NestJS (Apollo GraphQL)
- Integration: gRPC (grpc-js) with proto in `src/protos/transaction.proto`
- External transport: GraphQL (Playground enabled in non-production)

## Table of contents
- Overview
- Requirements
- Installation
- Configuration (environment variables)
- Running
- Endpoints and GraphQL schema
- Usage examples (queries/mutations)
- Available scripts
- Development (lint/format/test)
- Troubleshooting

## Overview
This service exposes operations to create and retrieve transactions via GraphQL and forwards them to the transactions microservice through gRPC. It also maps gRPC errors to standard GraphQL errors via a global filter.

## Requirements
- Node.js 18+ (20+ recommended)
- pnpm 9+

## Installation
1. Install dependencies:
   - pnpm install
2. (Optional) Build for production:
   - pnpm build

## Configuration (environment variables)
Create a `.env` file at the project root (you can use `.env.example` as a reference).

Supported variables:
- PORT: HTTP server port (default 3000; example: 6001)
- API_PREFIX: base prefix for HTTP/GraphQL routes (e.g., bff)
- TRANSACTION_MS_URL: URL of the transactions microservice over gRPC (host:port). Example: 127.0.0.1:6002

Example `.env`:
- PORT=6001
- API_PREFIX=bff
- TRANSACTION_MS_URL=127.0.0.1:6002

## Running
- Development (watch):
  - pnpm start:dev
- Simple development:
  - pnpm start
- Production (requires prior build):
  - pnpm start:prod

Useful URLs (with the example `.env` above):
- GraphQL (Playground/Schema): http://localhost:6001/bff/graphql
- Basic health (REST): GET http://localhost:6001/ returns `{ "message": "Hello!" }`

Notes:
- The GraphQL path is composed as `${API_PREFIX}/graphql`.
- In production (`NODE_ENV=production`) the Playground is disabled.

## Endpoints and GraphQL schema
Main operations exposed (see auto-generated `src/schema.gql`):
- Query
  - ping: String!
  - hello: String!
  - retrieveTransaction(input: RetrieveTransactionInput!): Transaction!
- Mutation
  - createTransaction(input: CreateTransactionInput!): Transaction!

Relevant types:
- input RetrieveTransactionInput { transactionId: String! }
- input CreateTransactionInput { accountExternalIdDebit: ID!, accountExternalIdCredit: ID!, transferTypeId: Int!, value: Float! }
- type Transaction { transactionId, transactionType { name }, transactionStatus { name }, value, createdAt }

## Usage examples (GraphQL)
Query to get a transaction:

```
query GetTx {
  retrieveTransaction(input: { transactionId: "a1b2c3" }) {
    transactionId
    transactionType { name }
    transactionStatus { name }
    value
    createdAt
  }
}
```

Mutation to create a transaction:

```
mutation CreateTx {
  createTransaction(
    input: {
      accountExternalIdDebit: "user-123"
      accountExternalIdCredit: "merchant-456"
      transferTypeId: 1
      value: 999.99
    }
  ) {
    transactionId
    transactionStatus { name }
    value
    createdAt
  }
}
```

## gRPC integration
- gRPC service consumed: `transaction.Transaction` as per `src/protos/transaction.proto`.
- Service address: defined by `TRANSACTION_MS_URL`.
- Client configured via `@nestjs/microservices` in `AppModule`.

## Available scripts
- pnpm start: starts the server in simple development mode
- pnpm start:dev: starts with watch (code and assets)
- pnpm start:prod: runs `node dist/main` (requires `pnpm build`)
- pnpm build: compiles TypeScript to `dist`
- pnpm test: runs unit tests
- pnpm test:e2e: runs e2e tests (if defined)
- pnpm test:cov: generates coverage
- pnpm lint: lint with ESLint (with fix)
- pnpm format: format with Prettier

## Development
- Linter: ESLint (config in eslint.config.mjs)
- Formatting: Prettier
- Testing: Jest (configured in package.json, `rootDir: src`)
- DevTools: GraphQL Playground active outside production

## Error handling
The global filter `GrpcToGqlExceptionFilter` translates gRPC codes to conventional GraphQL errors (e.g., INVALID_ARGUMENT -> BAD_USER_INPUT, NOT_FOUND -> NOT_FOUND, etc.) and attaches metadata when present.

## Troubleshooting
- ECONNREFUSED/UNAVAILABLE: ensure the gRPC microservice is reachable at `TRANSACTION_MS_URL` and the port is accessible.
- 404 on GraphQL: confirm `API_PREFIX` is correctly set. With `bff`, the path should be `/bff/graphql`.
- Playground not showing: it's disabled in production (`NODE_ENV=production`). Switch to development or enable according to your policy.
- Input typing errors: ensure your types match the schema (ID/Int/Float) and required fields are present.

## License
This project is distributed as UNLICENSED (see package.json).
