import { TransactionDto } from "@yape-transactions/shared";

export class CreateTransactionCommand {
    transactionData: TransactionDto;
    constructor(transactionData: TransactionDto) {
        this.transactionData = transactionData;
    }
}