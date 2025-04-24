import { TransactionOutput } from './transaction.output';
import { TransactionWithRelations } from '@/modules/transaction/domain/entities/transaction.types';

/**
 * Maps a transaction entity with related data to a GraphQL output DTO.
 * 
 * This function is responsible for transforming the internal representation
 * of a transaction (including its related type and status) into a shape
 * suitable for client responses.
 *
 * @param transaction - A transaction entity including its related transactionType and transactionStatus.
 * @returns A TransactionOutput DTO formatted for GraphQL responses.
 */
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
