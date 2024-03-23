

# Reto-Yape

Solo clonar el repositorio y ejecutar el comando: docker-compose up

Esto creará automaticamente los 5 servicios necesarios, también creará las tablas y los seeds.

Para probar las api puede hacerse desde postman o usando el playground de graphql

desde postman:

metodo crear Transacción:

query: {
  "accountExternalIdDebit": "4567-9875-5634-2236",
  "accountExternalIdCredit": null,
  "transferTypeId": 1,
  "value": 1200
}

<img width="641" alt="image" src="https://user-images.githubusercontent.com/62466867/231577435-af932acc-f79a-4aca-822e-58395075fe2b.png">

metodo consultar Transacción:

<img width="636" alt="image" src="https://user-images.githubusercontent.com/62466867/231577527-2d96b709-369d-4a77-b989-9f0ae4ce9712.png">

desde graphql:

metodo crear:

mutation {
  createTransaction(CreateTransactionWithGraphql: {
    accountExternalIdDebit: "4567-9875-5634-1934",
    accountExternalIdCredit: null,
    transferTypeId: 1,
    value: 500
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

<img width="957" alt="image" src="https://user-images.githubusercontent.com/62466867/231583764-f2cdef96-fcb6-4b9f-9ddd-25521d90b657.png">


metodo consultar:

query {
  findTransactionByExternalId(
    transactionExternalId: "bfbd8fa8-bc93-455e-bfe2-04fcb993b6c1") {
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

<img width="960" alt="image" src="https://user-images.githubusercontent.com/62466867/231583911-53d65e59-18ef-4cee-9315-e13ff82f778d.png">

Uso de kafka:

servicio transaction:

<img width="607" alt="image" src="https://user-images.githubusercontent.com/62466867/231585830-701060d8-24cc-4999-a448-de4d7528d929.png">

servicio anti-fraud:

<img width="775" alt="image" src="https://user-images.githubusercontent.com/62466867/231585720-6df7809e-af7a-4172-9445-028052fb304b.png">





