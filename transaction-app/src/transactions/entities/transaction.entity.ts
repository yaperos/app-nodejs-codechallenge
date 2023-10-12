import { TransactionStatus, TransactionType } from "../enums/transaction.enums";


export class Transaction {
    transactionExternalId: string;
    transactionType: TransactionType;
    transactionStatus: TransactionStatus;
    value: number;
    createdAt: Date;
}
