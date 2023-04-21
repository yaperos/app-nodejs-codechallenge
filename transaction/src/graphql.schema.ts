
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface GetTransactionDto {
    transactionExternalId: string;
    transactionType?: Nullable<GetTransactionTypeDto>;
    transactionStatus?: Nullable<GetTransactionStatusDto>;
    value?: Nullable<number>;
    createdAt?: Nullable<DateTime>;
}

export interface GetTransactionTypeDto {
    name: string;
}

export interface GetTransactionStatusDto {
    name: string;
}

export interface CreateTransactionDto {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
}

export interface Transaction {
    id: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
    tranferStatusId: number;
    createdAt: DateTime;
}

export interface IQuery {
    getTransaction(getTransactionDto: GetTransactionDto): Transaction | Promise<Transaction>;
}

export interface IMutation {
    createTransaction(createTransactionDto: CreateTransactionDto): Transaction | Promise<Transaction>;
}

export type DateTime = any;
type Nullable<T> = T | null;
