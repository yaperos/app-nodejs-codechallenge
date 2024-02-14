# Yape Code Challenge :rocket:

<p align="center">
  Use of NestJs with microservices Graphql Apollo Federation, broker message Kafka, hexagonal + DDD architecture, dependency injection and very good practices.
    <br>
</p>

## 📝 Table of Contents

- [Diagram](#diagram)
- [Design Database ER](#design_database)
- [Getting Started](#getting_started)
- [Deployment with Docker](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [Authors](#authors)

## 💾 Diagram Challenge Yape <a name = "diagram"></a>

<img width=800px height=400px src="resources/diagram_challenge.svg" alt="Design Database">


## 💾 Design Database ER <a name = "design_database"></a>

<img width=800px height=400px src="resources/database-design-ER.png" alt="Design Database">

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

Nodejs v.16 or higher

```
node --version
```

### Installing

Configure the .env file using the example file .env.example as a reference

```
GATEWAY_PORT=3000
TRANSACTION_MS_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/transaction?schema=public
TRANSACTION_MS_PORT=3001
TRANSACTION_MS_SERVICE_URL=http://localhost:${TRANSACTION_MS_PORT}/graphql
KAFKA_BROKER_URL=localhost:9092
```

Add project dependencies [NPM | YARN]

```

npm install

```

```

yarn

```

## 🚀 Deployment with Docker <a name = "deployment"></a>

```
docker compose up -d
```

Run the application in development

- Required steps

```
yarn migrate
yarn seed
```
To avoid any inconvenience, execute the commands in an orderly manner as described.

```
yarn start:dev transaction-ms
yarn start:dev anti-fraud-ms
yarn start:dev gateway-graphql
```

## 🎈 Usage <a name="usage"></a>

To view and interact with API GRAPHQL visit the documentation.

```

localhost:{your_port_for_gateway-graphql-ms}/graphql

example: [Graphql Apollo Federation](http://localhost:3000/graphql)

```

<img width=800px height=400px src="resources/1.png" alt="Endpoints">

```
Operation
mutation CreateTransaction($createTransactionInput: CreateTransactionInput!) {
  createTransaction(createTransactionInput: $createTransactionInput) {
    transactionExternalId
    transactionStatus {
      name
    }
    transactionType {
      name
    }
    createdAt
    value
  }
}

Variables
{
  "createTransactionInput": {
    "accountExternalIdCredit": "d10bd8c7-e9d7-472b-b5b9-5de263bf3c7f",
    "accountExternalIdDebit": "0905213a-55f3-45a5-a827-5988d339aafa",
    "typeId": 1,
    "value": 800
  }
}
```
<img width=800px height=400px src="resources/2.png" alt="Endpoints">

```
Operation
query Transaction($transactionId: String!) {
  findOne(transactionId: $transactionId) {
    transactionExternalId
    transactionType {
      name
    }
    transactionStatus {
      name
    }
    value
    createdAt
  }
}

Variables
{
  "transactionId": "UUID"
}
```

<img width=800px height=400px src="resources/3.png" alt="Endpoints">

<img width=800px height=400px src="resources/4.png" alt="Endpoints">

## 🔧 Running the tests <a name = "tests"></a>

run the tests

```

npm run test

```

or

```

yarn test

```

## ⛏️ Built Using <a name = "built_using"></a>

- [NodeJs](https://nodejs.org/en/) - Server Environment
- [NestJS](https://docs.nestjs.com/) - Server Framework
- [Prisma](https://www.prisma.io/) - ORM Database
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Kafka](https://kafka.apache.org/) - Message Broker
- [Docker](https://www.docker.com/) - Docker

## ✍️ Authors <a name = "authors"></a>

- [@ArthurDev](https://github.com/ArthurQR98) - Idea & Initial work