const db = new Mongo().getDB('yapechallenge');
db.getCollection('transactions').createIndex({
  transactionExternalId: 1,
  id: 1,
  createdAt: 1,
  accountExternalIdDebit: 1,
  accountExternalIdCredit: 1,
  value: 1
});