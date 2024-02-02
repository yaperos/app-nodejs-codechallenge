# Yape Code Challenge :rocket:
This Monoreporepository fulfills the yape code challenge requirements, and contains two microservices for validating finantial transactions.   
## Contents
- [About the requirement](#about-the-requirement)
- [Tech Stack](#tech-stack)
- [Useful Tools](#usesful-tools)
- [Getting Started](#getting-started)
- [Available Endpoints](#available-endpoints)
- [Service functionality](#service-functionality)
- [Important Notes](#important-notes)
  
## About the requirement
Every time a financial transaction is created, it must be validated by the anti-fraud microservice, and then the same service should send a message back to update the transaction status. Currently, there are only three valid transaction statuses:

- pending
- approved
- rejected

The unique validation will be that every transaction with a value greater than 1000 should be rejected.

  ```mermaid
  flowchart LR
    Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]
    Transaction --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction
    Transaction -- Update transaction Status event--> transactionDatabase[(Database)]
```

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

## Usesful tools
-  Insomnia as the API testing tool.
-  Compass as the GUI for reviewing MongoDB data.
-  Kafdrop as a web UI for viewing Kafka topics and browsing consumer groups. 

 There should be two resources:
 1. Resource to create a transaction:
    ```json
    {
      "accountExternalIdDebit": "Guid",
      "accountExternalIdCredit": "Guid",
      "tranferTypeId": 1,
      "value": 120
    }
    ```

 2. Resource to retrieve a transaction:

    ```json
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
```

 ## Getting started
 1. The following environment file (.env at the root path) is required for the proper functioning of the services.
    ```
    KAFKA_CLIENT_ID="app-yape"
    KAFKA_BROKERS="localhost:9092"
    KAFKA_CONSUMER_GROUPID="group1"
    KAFKA_TRANSACTIONS_TOPIC="transactions"
    KAFKA_VALID_TOPIC_NAME="Validatedtransactions"
    MONGODB_DATABASE="yape"
    MONGODB_HOST="localhost"
    MONGODB_PORT=27017
    MONGODB_CONNECTION="mongodb"
    ```
 3. The following steps should be applied in order to start the services.
    - Clone the repository locally.
    - There is an Insomnia_collection.yaml file inside the repository which is ready to be imported for testing the api transaction endpoints.
    - In a terminal(in the root path of the local repository), run the commands:
      - docker-compose -f docker-compose.yml up -d 
      - npm i
      - npm run start:both
    - Followed those steps, both applications will be running in parallel.
 
 ## Available endpoints
 1. Create Transaction: http://localhost:3000/api-transaction
 2. Update Transaction: http://localhost:3000/api-transaction/:id
 3. Get a single Transaction: http://localhost:3000/api-transaction/:id
 4. Get all Transactions: http://localhost:3000/api-transaction/all

 ## Service functionality
 1. The api-transaction exposes an endpoint for creating a transaction.
 2. Once the transaction is created with a *pending* status, this information is saved to mongoDB (database: yape / collection: transactions)
 3. At the same time, the information of the new transaction is sent to kafka (topic: transactions)
 4. While the api-anti-fraud is running, this service is listening the same kafka topic: *transactions*.
 5. Once a new message appears (new transaction sent in step 3), the anti fraud service validates the transaction and decides the next status, either *approved* or *rejected* based on the unique business rule. 
 6. The final status is sent by the anti fraud service to a new kafka topic: *Validatedtransactions*.
 7. While the api-transaction is running, this service is listening the same kafka topic: *Validatedtransactions*.
 8. Once a new message appears (transaction updated in step 6), the transactions service updates this status to the transactions collection in mongoDB.
    
 ## Important Notes:
 1. *Kafdrop* will be running in http://localhost:9000 url afterwards the docker yaml file is executed.
 2. The kafka service takes its time for creating the topics, and reading messages.  
 
