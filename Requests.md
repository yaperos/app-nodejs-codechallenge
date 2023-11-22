# Genera Una transferencia:

curl --location 'http://localhost:3000/api/transactions' \
--header 'Content-Type: application/json' \
--data '{
  "accountExternalIdDebit": "1161561615",
  "accountExternalIdCredit": "56156111652",
  "tranferTypeId": 1,
  "value": 100
}'

# Obtiene Una Transferencia:

curl --location --request GET 'http://localhost:3000/api/transactions' \
--header 'Content-Type: application/json' \
--data '{
  "transactionExternalId":"3140d576-f51d-4ad9-a503-e4e20295169a"
}'


# Obtine los datos Kafka:
apt install kafkacat
kafkacat -b kafka:9092 -t transaction-save-topic
kafkacat -b kafka:9092 -t transaction-getTransaction-topic
kafkacat -b kafka:9092 -t transaction-updateStatus-topic

# URL GraphQL:
http://localhost:3000/graphql

# Obtener Transacciones: 
query {
  getAllTransactions {
    transactionExternalId
    accountExternalIdDebit
    accountExternalIdCredit
    tranferTypeId
    value
    transactionStatus
    createdAt
  }
}

# Crear una nueva transacción
mutation {
  createTransaction(transactionData: {
    accountExternalIdDebit: "5151651",
    accountExternalIdCredit: "878778499",
    tranferTypeId: "1",
    value: 500
  }) {
    transactionExternalId
    accountExternalIdDebit
    accountExternalIdCredit
    tranferTypeId
    value
    transactionStatus
    createdAt
  }
}


# Obtener Transacción por Id:

query {
  getTransaction(transactionExternalId: "b587655a-c21d-4bd2-b45c-310a5805039b") {
    transactionExternalId
    accountExternalIdDebit
    accountExternalIdCredit
    tranferTypeId
    value
    transactionStatus
    createdAt
  }
}
