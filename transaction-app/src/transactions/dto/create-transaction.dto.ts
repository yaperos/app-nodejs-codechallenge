import { TransactionStatus, TransactionType } from "../enums/transaction.enums";


export class CreateTransactionDto {
    transactionExternalId: string;
    transactionType: TransactionType;
    transactionStatus: TransactionStatus;
    value: number;
    createdAt: Date;

    // constructor(data: {
    //     transactionExternalId: string;
    //     transactionType: { name: string };
    //     transactionStatus: { name: string };
    //     value: number;
    //     createdAt: Date;
    // }) {
    //     this.transactionExternalId = data.transactionExternalId;

    //     this.transactionType = TransactionType[data.transactionType.name.toUpperCase() as keyof typeof TransactionType];

    //     this.transactionStatus = TransactionStatus[data.transactionStatus.name.toUpperCase() as keyof typeof TransactionStatus];

    //     this.value = data.value;

    //     this.createdAt = data.createdAt;
    // }
}

