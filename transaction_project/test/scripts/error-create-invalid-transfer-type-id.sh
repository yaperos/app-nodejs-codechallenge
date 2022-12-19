curl -d "{ \"value\": 1000, \"accountExternalIdDebit\": \"02225205-9e62-4d7a-a506-8120ba07a111\", \
  \"accountExternalIdCredit\": \"02225205-9e62-4d7a-a506-8120ba07a222\", \
  \"transferTypeId\": 666 }" \
  -H "Content-Type: application/json" \
  -X POST http://localhost:4000/api/transaction
