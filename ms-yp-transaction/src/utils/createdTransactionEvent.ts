import { Transaction } from '../transaction/entities/transaction.entity';

export const createTransactionEvent = (transactionCreated: Transaction) => {
  return JSON.stringify({
    id: transactionCreated.id,
    transactionExternalId: 'Guid',
    transactionType: transactionCreated.tranferTypeId,
    transactionStatus: transactionCreated.transactionStatus,
    value: transactionCreated.value,
    createdAt: transactionCreated.createdAt.toISOString().split('T')[0],
  });
};
