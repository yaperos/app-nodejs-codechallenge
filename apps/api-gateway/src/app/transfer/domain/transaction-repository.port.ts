import { Observable } from "rxjs";
import { UUID } from "crypto";
import { TransactionDto } from "@yape-transactions/shared";

export interface TransactionRepositoryPort {
    createTransaction(transferDto: TransactionDto): Observable<UUID>;
}
export const TRANSACTION_REPOSITORY_PORT_TOKEN = "TRANSFER_REPOSITORY_PORT_TOEKN";

