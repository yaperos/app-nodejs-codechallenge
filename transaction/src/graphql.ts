
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class NewPost {
    title: string;
    content: string;
}

export class UpdatePost {
    id: string;
    published?: Nullable<boolean>;
    title?: Nullable<string>;
    content?: Nullable<string>;
}

export class NewTransaction {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
    status?: Nullable<string>;
}

export class UpdateTransaction {
    id: string;
    status: string;
}

export class Post {
    id?: Nullable<string>;
    title: string;
    content: string;
    published: boolean;
    createdAt: string;
}

export abstract class IQuery {
    abstract posts(): Nullable<Post>[] | Promise<Nullable<Post>[]>;

    abstract post(id: string): Nullable<Post> | Promise<Nullable<Post>>;

    abstract transactions(): Nullable<TransactionDB>[] | Promise<Nullable<TransactionDB>[]>;

    abstract transaction(id: string): Nullable<TransactionDB> | Promise<Nullable<TransactionDB>>;
}

export abstract class IMutation {
    abstract createPost(input?: Nullable<NewPost>): Post | Promise<Post>;

    abstract updatePost(input?: Nullable<UpdatePost>): Nullable<Post> | Promise<Nullable<Post>>;

    abstract deletePost(id?: Nullable<string>): Nullable<Post> | Promise<Nullable<Post>>;

    abstract createTransaction(input?: Nullable<NewTransaction>): Nullable<Response> | Promise<Nullable<Response>>;

    abstract updateTransaction(input?: Nullable<UpdateTransaction>): Nullable<TransactionDB> | Promise<Nullable<TransactionDB>>;

    abstract deleteTransaction(id?: Nullable<string>): Nullable<TransactionDB> | Promise<Nullable<TransactionDB>>;
}

export class TransactionName {
    name: string;
}

export class Response {
    transactionExternalId: string;
    transactionType: TransactionName;
    transactionStatus: TransactionName;
    value: number;
    createdAt: string;
}

export class TransactionDB {
    id?: Nullable<string>;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
    status?: Nullable<string>;
    createdAt?: Nullable<string>;
    updateAt?: Nullable<string>;
}

type Nullable<T> = T | null;
