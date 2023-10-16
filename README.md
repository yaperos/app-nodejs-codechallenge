# Yape Code Challenge :rocket:

Implementation for the code challenge. Two apps were implemented to match the requirements of the 
challenge: `ms-transactions` and `ms-anti-fraud` microservices.

# Running the application

1. Before running the application a `.env` file must be created inside the `src` folder.

```
DB_URL=mongodb://my_root:my_password@mongodb:27017
DB_NAME=challenge
TRANSACTION_APP_PORT=3000
ANTI_FRAUD__APP_PORT=3001
KAFKA_BROKER_URL=kafka:29092
KAFKA_CLIENT_ID=kafka_client
KAFKA_TRANSACTION_CONSUMER_ID=transaction_consumer
KAFKA_ANTI_FRAUD_CLIENT_ID=antifraud_client
KAFKA_ANTI_FRAUD_CONSUMER_ID=anti_fraud_consumer
```

2. Each app is configured on the `docker-compose.yml`. A recommended way to run the application could be:
   - The `zookeeper` service should be run first. This is due the service sometimes takes some time to be ready and
   the `kafka` service fails if it is not completely ready.
   ```
   docker-compose up zookeeper
   ```
   - The `mongodb`, `kafka` can be run at the same time.
   ```
   docker-compose up mongodb kafka
   ```
   - Lastly the `transactions` and `anti-fraud` services can be run at the same time or independently.
   ```
   docker-compose up transaction
   docker-compose up anti-fraud
   ```

# API Documentation

Two endpoints were implemented:
- **Create a transaction**
```http request
POST http://localhost:3000/transactions
Content-Type: application/json
{
  "accountExternalIdDebit": "652cdc41774fa79c0dd31486",
  "accountExternalIdCredit": "652cd6570ac46440d6b9e1a5",
  "transferTypeId": 1,
  "value": 1234
}

Response
{
    "transactionExternalId": "652cdc41774fa79c0dd31485",
    "transactionType": {
        "name": 1
    },
    "transactionStatus": {
        "name": "pending"
    },
    "value": 1234,
    "createdAt": "2023-10-16T16:46:25.236Z"
}
```
- **Retrieve a transaction**
```http request
GET http://localhost:3000/transactions/<transactionExternalId>

Response
{
    "transactionExternalId": "652cdc41774fa79c0dd31485",
    "transactionType": {
        "name": 1
    },
    "transactionStatus": {
        "name": "rejected"
    },
    "value": 1234,
    "createdAt": "2023-10-16T16:46:25.236Z"
}
```

# Tech Stack

<ol>
  <li> NestJS </li>
  <li> MongoDB </li>
  <li> Kafka </li>
  <li> Kafdrop </li>
  <li> Docker </li>
</ol>