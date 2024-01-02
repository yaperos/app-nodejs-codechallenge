import { TransactionStatusEnum } from "@yape-transactions/shared";
import { UUID } from "crypto";

export type NEW_STATUS_TRANSACTION = { transactionId: UUID, status: TransactionStatusEnum };

export class TransactionStatusCommand {
    transactionData: NEW_STATUS_TRANSACTION;
    constructor(transactionData: NEW_STATUS_TRANSACTION) {
        this.transactionData = transactionData;
    }
}