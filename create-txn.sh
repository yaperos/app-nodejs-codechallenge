curl --request POST \
  --url http://localhost:3000/graphql \
  --header 'Content-Type: application/json' \
  --data '{"query":"mutation {\n\tcreateTxn(\n\t\tinput: {\n\t\t\taccountExternalIdDebit: \"4301f3b9-5923-4e88-80c2-cbd2c6feafde\",\n\t\t\taccountExternalIdCredit: \"4301f3b9-5923-4e88-80c2-cbd2c6feafdc\",\n\t\t\ttransactionTypeId: 1,\n\t\t\tvalue: 331.98\n\t\t}\n\t){\n\t\ttransactionExternalId,\n\t\ttransactionStatus,\n\t\ttransactionTypeId,\n\t\tvalue,\n\t\tcreatedAt\n\t}\n}"}'