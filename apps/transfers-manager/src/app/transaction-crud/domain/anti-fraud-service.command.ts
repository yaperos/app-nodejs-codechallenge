import { TransactionDto } from "@yape-transactions/shared";

export class AntiFraudServiceCommand {
    transactionData: TransactionDto;
    constructor(transactionData: TransactionDto) {
        this.transactionData = transactionData;
    }

}