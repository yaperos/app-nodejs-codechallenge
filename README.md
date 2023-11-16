#To start the project:

```npm install```

```docker-compose up```

```npm start```

# Yape Code Challenge :rocket:

1. Resource to create a transaction that must containt:

```/api/create```

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

2. Resource to retrieve a transaction

```/api/:id```

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
