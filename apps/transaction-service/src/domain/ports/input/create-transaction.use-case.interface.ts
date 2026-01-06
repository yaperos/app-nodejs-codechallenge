import type { RequestContext } from '@app/common';
import type { Transaction } from '@domain/entities/transaction.entity';

export interface CreateTransactionDto {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
}

export interface ICreateTransactionUseCase {
    execute(dto: CreateTransactionDto, context?: Partial<RequestContext>): Promise<Transaction>;
}

export const CREATE_TRANSACTION_USE_CASE = 'CREATE_TRANSACTION_USE_CASE';
