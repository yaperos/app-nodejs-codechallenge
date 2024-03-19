import {StatusTransaction} from "./StatusTransactions";
import { ITransferType } from "./TransferType";

export interface ITransactionReceived {
    _id: string,
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    transferTypeId: ITransferType,
    value: number,
    transactionStatus: StatusTransaction,
    createdAt: Date,
    updatedAt: Date
}

export interface ITransactionSend {
    _id: string,
    transactionExternalId: string,
    transactionType: {
        name: string
    },
    transactionStatus: {
        name: StatusTransaction
    },
    value: number,
    createdAt: Date
}