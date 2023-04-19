
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

<img src="https://github.com/PietroArGal/PietroAramburu-YapeChallenge/blob/main/TestPics/postman1.png?raw=true"></img>

<img src="https://github.com/PietroArGal/PietroAramburu-YapeChallenge/blob/main/TestPics/postman2.png?raw=true"></img>

>GraphQL

<img src="https://github.com/PietroArGal/PietroAramburu-YapeChallenge/blob/main/TestPics/graphql1.png?raw=true"></img>

<img src="https://github.com/PietroArGal/PietroAramburu-YapeChallenge/blob/main/TestPics/graphql2.png?raw=true"></img>

>Kafka

<img src="https://github.com/PietroArGal/PietroAramburu-YapeChallenge/blob/main/TestPics/kafkapic.png?raw=true"></img>

>Contenedores Corriendo

<img src="https://github.com/PietroArGal/PietroAramburu-YapeChallenge/blob/main/TestPics/docker.png?raw=true"></img>