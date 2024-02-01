# Yape Code Challenge :rocket:
This Monoreporepository fulfills the yape code challenge requirements, and contains two microservices for validating finantial transactions.   
## Contents
- [About the requirement](#about-the-requirement)

## About the requirement
Every time a financial transaction is created, it must be validated by the anti-fraud microservice, and then the same service should send a message back to update the transaction status. Currently, there are only three valid transaction statuses:

- pending
- approved
- rejected

The unique validation will be that every transaction with a value greater than 1000 should be rejected.

  flowchart LR
    Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]
    Transaction --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction
    Transaction -- Update transaction Status event--> transactionDatabase[(Database)]

## Tech Stack
The complete tech Stack includes:
-  Node.js as the javascript execution environment.
-  NestJs as the main framework.
-  Hexagonal Architecture as the design pattern.
-  Typescript as the programming language (transpiled to javascript).
-  Kafka as the streamming messages provider.
-  MongoDB as the Non-relational database engine.
-  Mongoose as the ODM for MongoDB.
-  Docker && Docker compose for containerization.
-  Insomnia as the API testing tool.

 There should be two resources:
 1. Resource to create a transaction:
    {
      "accountExternalIdDebit": "Guid",
      "accountExternalIdCredit": "Guid",
      "tranferTypeId": 1,
      "value": 120
    }
 3. Resource to retrieve a transaction:
    {
      "transactionExternalId": "Guid",
      "transactionType": {
        "name": ""
      },
      "transactionStatus": {
        "name": ""
      },
      "value": 120,
      "createdAt": "Date"
    }

 ## Getting started
 1. The following environment file (.env at the root path) is required for the proper functioning of the services.
    KAFKA_CLIENT_ID="app-yape"
    KAFKA_BROKERS="localhost:9092"
    KAFKA_CONSUMER_GROUPID="group1"
    KAFKA_TRANSACTIONS_TOPIC="transactions"
    KAFKA_VALID_TOPIC_NAME="Validatedtransactions"
    MONGODB_DATABASE="yape"
    MONGODB_HOST="localhost"
    MONGODB_PORT=27017
    MONGODB_CONNECTION="mongodb"
 2. The following steps should be applied in order to start the services.
    2.1. Clone the repository locally.
    2.2. There is an Insomnia_collection.yaml file inside the repository which is ready to be imported for testing the api transaction endpoints.
    2.3. In a terminal(in the root path of the local repository), run the commands:
      2.4.1. docker-compose -f docker-compose.yml up -d 
      2.4.2. npm i
      2.4.3. npm run start:both
    2.4. Followed those steps, both applications will be running in parallel.


 4. 
 ## Available endpoints
 ##

