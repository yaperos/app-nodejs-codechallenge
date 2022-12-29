# CodeChallenge
### Challenge using the following technologies:
- Typescript
- NestJS
- Kafka
- Postgres
- Docker
- CQRS

## Initial Setup

1. Root directory contains a `docker-compose.yml` file. Run `docker-compose up` to create docker containers.
2. Enter to directory `ms-antifraud` and run `yarn install` to install dependencies.
3. Enter to directory `ms-antifraud` and run `yarn start:dev` to start the server.
4. Enter to directory `ms-transaction` and run `yarn install` to install dependencies.
5. Enter to directory `ms-transaction` and run `yarn start:dev` to start the server.
6. Set environment variables inside `ms-transaction` directory. Change values `.env.stage.dev` file or use the following variables:

```
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=12345
POSTGRES_DATABASE=transactions
```

# API Documentation

## Transaction

### Show API Swagger Documentation

```
GET /docs
```

### Create transaction
```
POST /transactions
```
```
{
  "accountExternalIdDebit": "f549b5ea-c956-453a-b78f-550948753925",
  "accountExternalIdCredit": "f549b5ea-c956-453a-b78f-550948753925",
  "tranferTypeId": 1,
  "value": 500
}
```


### Get transaction
```
GET /transactions/3fccb28f-b061-4213-9027-9b815bbcbe8a
```
```
{
    "transactionExternalId": "3fccb28f-b061-4213-9027-9b815bbcbe8a",
    "transactionType": {
        "name": 1
    },
    "transactionStatus": {
        "name": "APPROVED"
    },
    "value": 500,
    "createdAt": "2022-12-28T23:05:10.097Z"
}
```
