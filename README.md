# YAPE CHALLENGE

## Initial Setup 

### Execute docker for create container ( postgress database, kafka, zookeeper)

```sh
   docker-compose up -d
 ```
### Intall dependecies with yarn, enter each microservice ( Microservice - antifraud , Microservice Transaction)

```sh
   yarn
 ```

### copy env.example to env 

```sh
cp env.example env
```

### Initialize microservices, enter each microservice ( Microservice - antifraud , Microservice Transaction)

```sh
   yarn star:dev
 ```

### TEST 

```sh
   yarn test
 ```

### Documentation API 

http://localhost:3000/api

#### CREATE TRANSACTION 

```
POST http://localhost:3000/transaction
```

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

#### GET TRANSACTION 
```
GET http://localhost:3000/transaction/c5bf3864-e7d0-42cd-874a-6fbae47acdc1
```

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
