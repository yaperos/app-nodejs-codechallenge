VALUE=$1
curl -d "{ \"value\": ${VALUE}, \"accountExternalIdDebit\": \"02225205-9e62-4d7a-a506-8120ba07a111\", \
  \"accountExternalIdCredit\": \"02225205-9e62-4d7a-a506-8120ba07a222\", \"transferTypeId\": 4 }" \
  -H "Content-Type: application/json" \
  -X POST http://localhost:4000/api/transaction
