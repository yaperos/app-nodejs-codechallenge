import { Observable } from "rxjs";
import { UUID } from "crypto";
import { TransactionDto, TransactionResult } from "@yape-transactions/shared";

export interface TransactionRepositoryPort {
    createTransaction(transferDto: TransactionDto): Observable<UUID>;
    findTransaction(transactionId: UUID): Observable<TransactionResult>;

}

export const TRANSACTION_REPOSITORY_PORT_TOKEN = "TRANSFER_REPOSITORY_PORT_TOEKN";

