VALUE=$1
curl -d "{ \"value\": ${VALUE}, \"accountExternalIdDebit\": \"debitId1\", \
  \"accountExternalIdCredit\": \"creditId2\", \"transferTypeId\": 3 }" \
  -H "Content-Type: application/json" \
  -X POST http://localhost:4000/api/transaction
