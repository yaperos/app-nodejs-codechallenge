import { Observable } from "rxjs";
import { GetTransactionCommand } from "./get-transaction.command";
import { TransactionResult } from "@yape-transactions/shared";

export interface GetTransactionPort {
    findTransactionById(transactionId: GetTransactionCommand): Observable<TransactionResult | null>;
}
export const GET_TRANSACTION_PORT_TOKEN = "GET_TRANSACTION_PORT_TOKEN";