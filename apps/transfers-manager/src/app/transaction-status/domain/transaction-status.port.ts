import { NEW_STATUS_TRANSACTION } from "@yape-transactions/shared";

export interface TransactionStatusPort {
    updateTransactionStatus(txData: NEW_STATUS_TRANSACTION);
}
export const TRANSACTION_STATUS_PORT_TOKEN = "TRANSACTION_STATUS_PORT_TOKEN";
