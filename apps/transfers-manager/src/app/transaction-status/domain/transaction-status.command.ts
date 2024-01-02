import { NEW_STATUS_TRANSACTION } from "@yape-transactions/shared";


export class TransactionStatusCommand {
    transactionData: NEW_STATUS_TRANSACTION;
    constructor(transactionData: NEW_STATUS_TRANSACTION) {
        this.transactionData = transactionData;
    }
}