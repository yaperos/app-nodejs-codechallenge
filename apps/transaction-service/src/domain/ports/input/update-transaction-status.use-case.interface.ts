import type { RequestContext } from '@app/common';
import type { Transaction } from '@domain/entities/transaction.entity';
import type { TransactionStatus } from '@domain/value-objects/transaction-status.vo';

export interface IUpdateTransactionStatusUseCase {
    execute(transactionId: string, status: TransactionStatus, context?: Partial<RequestContext>): Promise<Transaction>;
}

export const UPDATE_TRANSACTION_STATUS_USE_CASE = 'UPDATE_TRANSACTION_STATUS_USE_CASE';
