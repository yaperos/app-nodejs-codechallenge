import { Transaction } from '@transactions/domain/transaction.entity';
import { TransactionResponseDto } from '@transactions/infrastructure/dtos/transaction-response.dto';

export const toResponse = (
  transaction: Transaction,
): TransactionResponseDto => {
  return {
    transactionExternalId: transaction.externalId,
    transactionType: transaction.transferTypeId,
    transactionStatus: transaction.status,
    value: transaction.value,
    createdAt: transaction.createdAt,
  };
};
