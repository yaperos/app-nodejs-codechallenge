
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class NewTransaction {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
}

export class UpdateTransaction {
    id: number;
    statusArray: string;
}

export class Status {
    id?: Nullable<number>;
    transactionId?: Nullable<number>;
    status?: Nullable<string>;
    createdAt?: Nullable<Date>;
}

export class TransactionName {
    name: string;
}

export class Response {
    transactionExternalId: number;
    transactionType: TransactionName;
    transactionStatus: TransactionName;
    value: number;
    createdAt?: Nullable<Date>;
}

export class TransactionDB {
    id?: Nullable<number>;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
    statusArray?: Nullable<Nullable<Status>[]>;
    createdAt?: Nullable<Date>;
    updateAt?: Nullable<Date>;
}

export abstract class IQuery {
    abstract transactions(): Nullable<TransactionDB>[] | Promise<Nullable<TransactionDB>[]>;

    abstract transaction(id: string): Nullable<TransactionDB> | Promise<Nullable<TransactionDB>>;
}

export abstract class IMutation {
    abstract createTransaction(input?: Nullable<NewTransaction>): Nullable<Response> | Promise<Nullable<Response>>;

    abstract updateTransaction(input?: Nullable<UpdateTransaction>): Nullable<TransactionDB> | Promise<Nullable<TransactionDB>>;

    abstract deleteTransaction(id?: Nullable<string>): Nullable<TransactionDB> | Promise<Nullable<TransactionDB>>;
}

type Nullable<T> = T | null;
