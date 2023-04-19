
# Yape Challenge - Pietro Aramburú

## Ejecución

1. Clonar el repo
2. Ejecutar: 	`docker-compose up`

---

## Pruebas

> Utilizar algún cliente API o el pg de Graphql.

---

## Clientes de API:

1. Crear Transacción:

- http://localhost:3000/api/transactions

`
{
  "accountExternalIdDebit": "1619-3241-6587-0516",
  "accountExternalIdCredit": "1619-1271-6587-0516",
  "transferTypeId": 1,
  "value": 169
}
`

2. Consultar Transacción:

- http://localhost:3000/api/transactions/transactionId

---

## Graphql:

- http://localhost:3000/graphql

1. Crear Transacción:

`
mutation {
  createTransaction(CreateTransactionWithGraphql: {
    accountExternalIdDebit: "1619-3241-6587-0516",
    accountExternalIdCredit: "1619-3241-6587-0516",
    transferTypeId: 1,
    value: 169
  }) {
    id
    transactionExternalId
    value
    createdAt
    accountExternalIdDebit
    accountExternalIdCredit
    transferType {
      id
      name
    }
    transactionStatus {
      id
      name
    }
  }
}
`


2. Consultar Transacción:

`query {
  findTransactionByExternalId(
    transactionExternalId: "Aqui va el transactionId") {
    transactionExternalId
    value
    createdAt
    accountExternalIdDebit
    accountExternalIdCredit
    transferType {
      id
      name
    }
    transactionStatus {
      id
      name
    }
  }
}
`

---

## Screenshots:

>API Client (Postman)



>GraphQL



>Contenedores Corriendo
