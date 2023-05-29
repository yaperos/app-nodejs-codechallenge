# Yape Code Challenge :rocket: - Alejo Bianchi

## Description

In this repository is the implementation of `Yape Code Challenge` ([instructions here](./README-CHALLENGE.md)), which consists of a REST API that manages Transactions and an Anti-Fraud service used to validate all Transactions created.


#### Services

The idea of ​​the services is to implement it with hexagonal architecture

<img src="images/hexagonal.png" alt="Hexagonal" width="380">

The goal is to create loosely coupled application components that can be easily connected to your software environment through ports and adapters.

To see the detail in the implementation of the projects and what the folders represent, go to the readme of each project.

- Transaction Service: This service is responsible for managing all transactions, it is the entry point for creating transactions and also has the responsibility of notifying the Anti-Fraud service when a transaction is created. Here you can find the readme of the service `transaction-service` ([readme](./transaction-service/README.md)).

- Antifraud Service: This service is responsible for validating all transactions created, it is the entry point for validating transactions and also has the responsibility of notifying the Transaction service when a transaction is approved or rejected. Here you can find the readme of the service `antifraud-service` ([readme](./antifraud-service/README.md)).
## ENVIRONMENT

- Typescript
- Nestjs - Fastify
- Docker
- Mongodb - Mongoose
- Kafka

### Requirements

- It is necessary for tests from local environment that the kafka and mongodb services are running.
- Environment variables need to be complete.


### Local setup

Fisrt it is necessary to use some environment variables so that the service can connect to the servers. Add the following variables to your .env file:

```
.env.example

# Antifraud Service
PORT=3005
NODE_ENV=development
KAFKA_HOST_URL=localhost:9092
KAFKA_TOPIC_TRANSACTION_CREATED=KAFKA-TOPIC-TRANSACTION-CREATED
KAFKA_TOPIC_TRANSACTION_APPROVED=KAFKA-TOPIC-TRANSACTION-APPROVED
KAFKA_TOPIC_TRANSACTION_REJECTED=KAFKA-TOPIC-TRANSACTION-REJECTED
KAFKA_CLIENT_ID=ANTIFRAUD-SERVICE
KAFKAJS_NO_PARTITIONER_WARNING=1
KAFKA_GROUP_ID=TEST-GROUP-ANTIFRAUD
KAFKA_NAME=KAFKA-SERVICE

# Transaction Service
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://root:password123@localhost:27017/yape?authSource=admin&readPreference=primary
KAFKA_HOST_URL=localhost:9092
KAFKA_TOPIC_TRANSACTION_CREATED=KAFKA-TOPIC-TRANSACTION-CREATED
KAFKA_TOPIC_TRANSACTION_APPROVED=KAFKA-TOPIC-TRANSACTION-APPROVED
KAFKA_TOPIC_TRANSACTION_REJECTED=KAFKA-TOPIC-TRANSACTION-REJECTED
KAFKAJS_NO_PARTITIONER_WARNING=1
KAFKA_GROUP_ID=TEST-GROUP-TRANSACTION
```


To start all services in docker: 

```sh
# Start Up
make start-all-services
```

If the make command does not work you can run the following command

```sh
# Start Up
docker-compose up -d
```

After that, the database, kafka server, transaction-service and antifraud-service are up and running on docker.

#### Api transaction-service

The transaction-service is running on port 3000 and the api documentation is available at http://localhost:3000/swagger#/

The available endpoints are listed below, you can import the postman collection found in the "collection" folder.

```sh
# Tests api start
curl -X 'GET' \
  'http://localhost:3000/ping' \
  -H 'accept: */*'

# Create transaction
curl -X 'POST' \
  'http://localhost:3000/v1/api/transactions' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "transferTypeId": "1",
  "value": 500
}'

# Get transaction by id
curl -X 'GET' \
  'http://localhost:3000/v1/api/transactions/${transactionExternalId}' \
  -H 'accept: application/json'

# Get all transactions
curl -X 'GET' \
  'http://localhost:3000/v1/api/transactions' \
  -H 'accept: application/json'

```
#### Test operation



#### Vscode Debugging

Set a breakpoint in the code and press F5 to start debugging.
![Breakpoint](images/breakpoint-debug.png?raw=true "Breakpoint")

Or manual run the debugger with the configuration "Launch Program".
![Run](images/run-debug.png?raw=true "Run")

*Note: debugging does not feature hot reload.*

