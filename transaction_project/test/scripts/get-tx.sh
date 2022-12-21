TRANSACTION_ID=$1
curl -H "Content-Type: application/json" \
  http://localhost:4000/api/transaction/${TRANSACTION_ID}
