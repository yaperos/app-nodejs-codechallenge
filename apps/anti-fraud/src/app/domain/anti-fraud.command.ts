import { TransactionDto } from "@yape-transactions/shared";

export class AntiFraudCommand {
    transaction: TransactionDto;
    constructor(transaction: TransactionDto) {
        this.transaction = transaction;
    }
}