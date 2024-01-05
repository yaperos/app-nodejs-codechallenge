curl --request POST \
  --url http://localhost:3000/graphql \
  --header 'Content-Type: application/json' \
  --data '{"query":"query {\n\tgetTxn(id: \"d84ba9cc-8f2c-4227-870d-7e39f216448a\") {\n\t\ttransactionExternalId\n\t\ttransactionStatus\n\t\ttransactionTypeId\n\t\tvalue\n\t\tcreatedAt\n\t}\n}"}'