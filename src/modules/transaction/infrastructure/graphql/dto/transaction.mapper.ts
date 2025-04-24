import { TransactionOutput } from './transaction.output';
import { TransactionWithRelations } from '@/modules/transaction/domain/entities/transaction.types';

export function toTransactionOutput(transaction: TransactionWithRelations): TransactionOutput {
  return {
    transactionExternalId: transaction.id,
    transactionType: {
      name: transaction.transactionType.name,
    },
    transactionStatus: {
      name: transaction.transactionStatus.name,
    },
    value: transaction.value,
    createdAt: transaction.createdAt,
  };
}
