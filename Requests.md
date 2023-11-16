# Genera Una transferencia 

curl --location 'http://localhost:3000/api/transactions' \
--header 'Content-Type: application/json' \
--data '{
  "accountExternalIdDebit": "1161561615",
  "accountExternalIdCredit": "56156111652",
  "tranferTypeId": 1,
  "value": 100
}'

# Obtiene Una Transferencia

curl --location --request GET 'http://localhost:3000/api/transactions' \
--header 'Content-Type: application/json' \
--data '{
  "transactionExternalId":"3140d576-f51d-4ad9-a503-e4e20295169a"
}'