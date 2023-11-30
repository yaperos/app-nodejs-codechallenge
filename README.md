# Yape Challenge

## Introduction 
Project to handle the creation and validation to a transaction, thorugh a microservices based arquitecture exposed by a gateway.
Tech stack: Nest.js, TypeScript, Kafka, GraphQL, Postgres and TypeOrm.

### Installation

Requirements: Node version 18+, docker and pnpm.
This project is build using a monorepo, so ymake sure to follow those instructions to be avaible to run it.

1. Firts of all you should run the docker yml file that is in the root of the repository.
```bash
docker-compose up
```
or 
```bash
docker compose up
```
2. Install dependencies requiered for this project:
```bash
pnpm i
```

3. Now create a .env file in the root of the project, here you can see an example:

```bash
GATEWAY_PORT=3000
DATABASE_URL=postgresql://gate:gate@localhost:5432/yapechallenge?schema=public

TRANSACTION_PORT=3001
TRANSACTION_SERVICE_URL=http://localhost:${TRANSACTION_PORT}/graphql

ANTI_FRAUD_PORT=3002
ANTI_FRAUD_SERVICE_URL= http://localhost:${ANTI_FRAUD_PORT}/graphql

KAFKA_BROKER_URL=localhost:9092

POSTGRES_DB_NAME=yape
POSTGRES_DB_PORT=5432
POSTGRES_DB_PASSWORD=postgres
POSTGRES_DB_USER=postgres
POSTGRES_DB_HOST=localhost 
```

Now you're almost ready... there are some test that you can run before everything to make sure everything is fine

4. Make sure to run Transaction and AntiFraud applications before trying to run the Gateway App.
```bash
nest start transaction
```

```bash
nest start anti-fraud
```

Once both of them are running complete run the Gateway app:
```bash
nest start gateway
```



And thats it, the project may be runing fine, now you can open your browser, and start playing: 
http:localhost:3000/graphql