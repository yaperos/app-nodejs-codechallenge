import { Result } from 'neverthrow';
import { TransactionEntity } from '../entities/transaction.entity';
import {
  TransactionCreateException,
  TransactionFindException,
  TransactionUpdateException,
} from '../exceptions/transaction.exception';

export type CcreateTransactionResult = Result<void, TransactionCreateException>;
export type UpdateTransactionResult = Result<void, TransactionUpdateException>;
export type FindTransactionResult = Result<
  TransactionEntity,
  TransactionFindException
>;

export interface TransactionRepository {
  createTransaction(
    transaction: TransactionEntity,
  ): Promise<CcreateTransactionResult>;
  updateTransaction(
    transaction: TransactionEntity,
  ): Promise<UpdateTransactionResult>;
  findTransaction(transactionId: string): Promise<FindTransactionResult>;
}
