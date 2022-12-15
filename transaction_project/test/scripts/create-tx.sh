VALUE=$1
curl -d "{ \"value\": ${VALUE} }"  -H "Content-Type: application/json" -X POST http://localhost:4000/api/transaction