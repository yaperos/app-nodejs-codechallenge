# Fintran API:

Transaction app implemented with the following stack:

<ul>
  <li> NestJS </li>
  <li> PostgresSQL </li>
  <li> Kafka </li>
  <li> Kafdrop </li>
  <li> Docker </li>
</ul>

We used a microservices arquitecture.

## How to run the app?

1. Create your .env:

```
TRANSACTION_PENDING_STATUS='pending'
TRANSACTION_REJECTED_STATUS='rejected'
TRANSACTION_SUCCESS_STATUS='success'

TRANSACTIONS_API_PORT=3000

DB_PORT=5432
DB_HOST='0.0.0.0'
DB_TYPE='postgres'
DB_NAME='postgres'
DB_USERNAME='postgres'
DB_PASSWORD='postgres'

KAFKA_SERVICE_NAME='TRANSACTION_SERVICE'
KAFKA_BROKER='localhost:9092'
KAFKA_TRANSACTIONS_CLIENT_ID='transactions'
KAFKA_ANTIFRAUD_CONSUMER_GROUP_ID='antifraud-consumer'
KAFKA_TRANSACTIONS_CONSUMER_GROUP_ID='transactions-consumer'

```

2. Initialize docker compose:

   ```
   docker-compose up
   ```

3. Running the microservices in your local:
   ```
    nest start antifraud --watch
   ```
   ```
   nest start transactions --watch
   ```

## API

**Create a transaction**

```
http request
POST http://localhost:3000
Content-Type: application/json
{
  "accountExternalIdDebit": uuid,
  "accountExternalIdCredit": uuid,
  "transferTypeId": number,
  "value": number
}
```

**Retrieve a transaction**

```
http request
GET http://localhost:3000/<transactionId>

Response
{
   "transactionExternalId": string,
   "transactionType": {
       "name": number
   },
   "transactionStatus": {
       "name": string
   },
   "value": number,
   "createdAt": date
}
```
