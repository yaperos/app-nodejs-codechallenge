# Yape Code Challenge Solution :rocket:

## Stack
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [GraphQL](https://graphql.org/)
- [Apollo](https://www.apollographql.com/)
- [Kafka](https://kafka.apache.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Description
The proposed solution implements a monorepo with three applications using the NestJS framework:
- Transaction
- Anti Fraud
- Gateway

## How to run it?
To make the running process easier, I've created a Makefile with some utilities.

1. Install dependencies:
  ```bash
  npm i
  ```

2. Generate `.env` files based on the `.env.example` ones
  ```bash
  make env-generate
  ```
3. Initiate Docker based on the `docker-compose.yml` file
  ```bash
  make docker-start
  ```
4. Push migrations and run database seed
  ```bash
  make init-db
  ```
5. Run transaction service
  ```bash
  make run-transaction
  ```
6. Run anti fraud service
  ```bash
  make run-anti-raud
  ```
7. Run gateway
  ```bash
  make run-gateway
  ```

## How to make requests?
1. Go to the [GraphQL playground](http://localhost:8000/graphql)
2. Execute `createTransaction` mutation
  ```graphql
  mutation ($data: CreateTransactionDto!) {
    createTransaction(createTransactionDto: $data) {
      transactionExternalId
      transactionType {
        name
      }
      transactionStatus {
        name
      }
      createdAt
      value
    }
  }

  
  # Query variables example:
  {
    "data": {
      "accountExternalIdDebit": "98af23a7-b1b7-463d-9170-edb6154674b9",
      "accountExternalIdCredit": "2d4649bd-c6cf-420c-a642-bd4dd24da00d",
      "transactionTypeId": 1,
      "value": 850
    }
  }
  ```
3. Check for the created transaction using the `findTransactionById` query:
  ```graphql
  query($id: String!) {
    findTransactionById(transactionExternalId: $id) {
      transactionType {
        name
      }
      transactionStatus {
        name
      }
      createdAt
      value
    }
  }

  # Query variables example:
  {
    "id": "db551c17-441b-48a1-81a9-eeefd91f7665"
  }
  ```

**Note:**
You can use Prisma Studio to check the database changes.
```bash
make prisma-studio
```