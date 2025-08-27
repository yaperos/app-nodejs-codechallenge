# POST
Example:
```curl
curl --location 'http://localhost:3001/payments' \
--header 'Content-Type: application/json' \
--data-raw '
{
  "email": "juan@diaz.com",
  "accountExternalIdDebit": "e0176043-4e19-4408-bf33-da407ec4b01d",
  "accountExternalIdCredit": "e0176043-4e19-4408-bf33-da407ec4b01d",
  "tranferTypeId": 1,
  "value": 1200
}'
```
# GET
Example:
```curl
curl --location 'http://localhost:3001/payments/03c95a46-bcb6-42b8-84c1-b213f65401cd'
```