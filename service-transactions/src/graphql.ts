
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateTransactionInput {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
}

export abstract class IQuery {
    abstract findTransaction(externalId?: Nullable<number>): RetrieveTransaction | Promise<RetrieveTransaction>;
}

export abstract class IMutation {
    abstract saveTransaction(data?: Nullable<CreateTransactionInput>): TransactionEntity | Promise<TransactionEntity>;
}

export class Transaction {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
}

export class TransactionEntity {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId?: Nullable<number>;
    value: number;
    transactionExternalId: number;
}

export class RetrieveTransaction {
    transactionExternalId: number;
    transactionStatus: string;
    transactionType?: Nullable<number>;
    value: number;
    createdAt: DateTime;
}

export type DateTime = any;
type Nullable<T> = T | null;
