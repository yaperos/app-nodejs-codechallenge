export const TransactionQueueSchema = {
  requestId: 'requestId',
  value: 'value',
};

export const statusSchema = {
  accountExternalIdDebit: 'transactionExternalId',
  tranferTypeId: 'transactionType.name',
  status: 'transactionStatus.name',
  value: 'value',
  createdAt: 'createdAt',
};
