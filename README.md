# Yape Code Challenge :rocket:

Steps application install :smile:. 

- [Requeriments](#Requeriments)
- [Step 1](#Step_1)
- [Step 2](#Step_2)
- [Step 3](#Step_3)
- [Operation](#Operation)


# Requeriments

- docker_cli
- nodev_v18+
- docker-compose_cli

# Steps: 
  ## Step 1

  ```cmd
    clazaro ❯ npm install
  ```

  ## Step 2

  ```cmd
    clazaro ❯ docker-compose --env-file .\env.dev up -d postgres zookeeper kafka
  ```
  ## Step 3

  ```cmd
    clazaro ❯ npm run start:dev
  ```

# Test
```cmd
  clazaro ❯  npm run test:cov
```

# Optional
Create local use project docker-compose: 

```cmd
  clazaro ❯ docker-compose --env-file .\env.uat up 
```

# Operation
1. querys create: 

```graphql
mutation Transactions($transactionRequest: TransactionRequest!) {
  registers(transactionRequest: $transactionRequest) {
    transactionExternalId,
    accountExternalIdDebit,
    accountExternalIdCredit,
    transactionType {
      name
    }
    transactionStatus{
      name
    },
    valueTransaction,
     createdAt
  }
}
### enviroment
{
  "transactionRequest": {
    "transactionRequest": [
      {
        "accountExternalIdDebit": "CRD-00001-1",
        "accountExternalIdCredit": "CRD-00001-1",
        "transactionType": 1,
        "value": 1500
        
      }
    ]
  }
}

### http header
{
  "authorization":"12345"
}

```

2. Resource to retrieve all transactions

```graphql
query {
  getTransactions {
    transactionExternalId,
    transactionType {
      name
    }
    transactionStatus{
      name
    },
    valueTransaction,
     createdAt
  }
}

### http header
{
  "authorization":"12345"
}
```


3. Resource to retrieve one transaction

```graphql
query ($id: String!) {
  getTransactionsById(id: $id){
    transactionExternalId,
    transactionType {
      name
    }
    transactionStatus{
      name
    },
    valueTransaction,
     createdAt
  }
}

### enviroment

{
  "id": "4c4908c3-840e-447f-9a21-44a1c0176490"
}

### http header
{
  "authorization":"12345"
}
```