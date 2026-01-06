import type { RequestContext } from '@app/common';
import type { Transaction } from '@domain/entities/transaction.entity';

export interface IGetTransactionUseCase {
    execute(transactionId: string, context?: Partial<RequestContext>): Promise<Transaction>;
}

export const GET_TRANSACTION_USE_CASE = 'GET_TRANSACTION_USE_CASE';
