#!/bin/bash

# Endpoint: create
echo "Creating transaction..."
response=$(curl -X POST -H "Content-Type: application/json" -d '{
  "accountExternalIdDebit": "abc123",
  "accountExternalIdCredit": "def456",
  "transferTypeId": "1",
  "value": 10000
}' http://localhost:3000/transactions)

# Obtener el transactionExternalId del resultado
uuid=$(echo $response | jq -r '.transactionExternalId')
echo "Transaction created with UUID: $uuid"

# Guardar el UUID en una variable de entorno para su uso posterior
export UUID=$uuid

# Endpoint: retrieve
echo "Retrieving transaction with UUID: $uuid"
curl -X GET http://localhost:3000/transactions/$uuid

# Endpoint: antifraud
# echo "Performing anti-fraud check for transaction with UUID: $uuid"
# curl -X POST -H "Content-Type: application/json" -d '{
# "transactionExternalId": "'$uuid'",
# "accountExternalIdDebit": "a8c9f420-4fe1-4e86-ae2d-8d0e9d8883e4",
# "accountExternalIdCredit": "b7d6e533-52cc-4c9e-af13-8b03f83d7fd9",
# "transferTypeId": "f6e2b53a-37fe-47b4-85a7-0e0b286dcf3d",
# "value": 1000,
# "status": "pending",
# "createdAt": "2023-05-18T15:30:00.000Z"
# }' http://localhost:4000/

# Endpoint: update
# echo "Updating transaction with UUID: $uuid"
# curl -X PUT -H "Content-Type: application/json" -d '{
# "transactionExternalId": "'$uuid'",
# "accountExternalIdDebit": "a8c9f420-4fe1-4e86-ae2d-8d0e9d8883e4",
# "accountExternalIdCredit": "b7d6e533-52cc-4c9e-af13-8b03f83d7fd9",
# "transferTypeId": "f6e2b53a-37fe-47b4-85a7-0e0b286dcf3d",
# "value": 1000,
# "status": "approve",
# "createdAt": "2023-05-18T15:30:00.000Z"
# }' http://localhost:3000/transactions
