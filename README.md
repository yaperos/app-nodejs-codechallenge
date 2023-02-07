# Fork: Yape Code Challenge :rocket:
## Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status.

## Solution
The solution consists of an api-gateway and two microservices. The api-gateway has the responsability of receiving two requests (see postman file attached):
- Transaction creation
- Search transaction by transactionExternalId

The transaction microservice creates the transaction with the initial state in PENDING, then validates the transaction created with the anti-fraud microservice which receives the value of the transaction created and if it exceeds the value of 1000 it's detected as fraud and the state change to REJECTED. In opposite case is detected as valid and the state change to APPROVED.

## Requirements
- Node 16
- Docker cli
- Docker compose cli
- Database management client (dbeaver)

## Installation
First use docker compose to up database and kafka service in your local machine.
```
docker-compose up
```
Create database with name `transaction-db` to use in transaction-microservice.
Then insert these commands inside each project:
- api-gateway
- fraud-detection-microservice
- transaction-microservice

### api-gateway
```
npm i
npm start
```
### transaction-microservice
```
npm i
cp .env.example .env
npm start
```

### fraud-detection-microservice
```
npm i
npm start
```

## Usage
With the project ready you can send request to create transaction and get data about transaction created. You should export [endpoints-documentation.json](endpoints-documentation.json) file in postman.