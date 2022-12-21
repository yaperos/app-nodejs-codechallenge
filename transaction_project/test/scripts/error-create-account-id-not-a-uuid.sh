curl -d "{ \"value\": 140, \"accountExternalIdDebit\": \"001-abcdef-002\", \
  \"accountExternalIdCredit\": \"02225205-9e62-4d7a-a506-8120ba07a222\", \"transferTypeId\": 3 }" \
  -H "Content-Type: application/json" \
  -X POST http://localhost:4000/api/transaction
