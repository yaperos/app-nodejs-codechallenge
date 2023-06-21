
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Status {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export enum TransferType {
    IMPS = "IMPS",
    NEFT = "NEFT",
    RTGS = "RTGS"
}

export class Transaction {
    __typename?: 'Transaction';
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transactionType: TransferType;
    transactionStatus: Status;
    value: number;
    createdAt: Date;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract transactionById(id: string): Nullable<Transaction> | Promise<Nullable<Transaction>>;
}

type Nullable<T> = T | null;
