import { Transaction } from '@domain/transaction';
import { CreateTransactionResponseDto } from '../dto/create-transaction.response.dto';
import { TransactionViewDto } from '../dto/transaction.view.dto';

export const toCreateTransactionResponseDto = (
  transaction: Transaction,
): CreateTransactionResponseDto => ({
  transactionExternalId: transaction.transactionExternalId,
  transactionStatus: { name: transaction.status },
  createdAt: transaction.createdAt.toISOString(),
});

export const toTransactionViewDto = (
  transaction: Transaction,
): TransactionViewDto => ({
  transactionExternalId: transaction.transactionExternalId,
  transactionType: { name: `transferTypeId:${transaction.transferTypeId}` },
  transactionStatus: { name: transaction.status },
  value: transaction.value,
  createdAt: transaction.createdAt.toISOString(),
});
