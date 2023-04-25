# Yape Code Challenge :rocket:

## Run with Docker

Run the following command to start all services (Kafka, Zookeeper, DB, Transaction Service, Antifraud Service). This should also seed the db.

```sh
docker compose up -d
```

## API
[Postman collection](yape-nodejs-technical-challenge.postman_collection.json)

### Create transaction
<code>POST</code> <code>http://localhost:3000/transactions</code>
#### Body

```sh
{
  "accountExternalIdDebit": "a59f7116-dae9-474c-b319-4140e1678a7c",
  "accountExternalIdCredit": "a59f7116-dae9-474c-b319-4140e1678a7c",
  "tranferTypeId": 1,
  "value": 120
}
```

### Get transactions
<code>GET</code> <code>http://localhost:3000/transactions?limit={number}&offset={number}</code>

### Get transaction by External ID
<code>GET</code> <code>http://localhost:3000/transactions/{id}</code>

## Useful commands

### Migrate and seed database

```sh
cd challenge-project
npm run transaction:prisma:deploy
```

### Restart and seed database (rebuild container)

```sh
cd challenge-project
npm run transaction:db:restart
```