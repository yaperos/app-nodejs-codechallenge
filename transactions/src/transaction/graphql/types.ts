
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum TransferType {
    IMPS = "IMPS",
    NEFT = "NEFT",
    RTGS = "RTGS"
}

export enum Status {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export class Transaction {
    id: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferType: TransactionType;
    transactionStatus: TransactionStatus;
    value: number;
    createdAt: Date;
}

export class TransactionType {
    id: NumericID;
    name: TransferType;
}

export class TransactionStatus {
    id: NumericID;
    name: Status;
}

export abstract class IQuery {
    abstract transactionById(id: string): Nullable<Transaction> | Promise<Nullable<Transaction>>;
}

export type NumericID = any;
type Nullable<T> = T | null;
