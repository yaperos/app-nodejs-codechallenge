import { Observer } from '../Observer/transation.observer';
export interface ITransaction {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
    transactionExternalId: string;
    transactionType: string;
    transactionStatus: string;
    createdAt?: Date;
}
export declare class Transaction implements ITransaction {
    private observers;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
    transactionExternalId: string;
    transactionType: string;
    transactionStatus: string;
    createdAt?: Date;
    constructor(transactionInfo: ITransaction);
    attach(observer: Observer): void;
    detach(observer: Observer): void;
    getStatus(): string;
    setStatus(status: string): void;
    private notify;
}
