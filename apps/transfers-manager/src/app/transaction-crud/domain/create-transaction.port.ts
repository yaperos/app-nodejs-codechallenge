import { TransactionDto } from '@yape-transactions/shared';
import { UUID } from 'crypto';
import { Observable } from 'rxjs';

export interface CreateTransactionPort {
    createTransaction(txDto: TransactionDto): Observable<UUID>;
}
export const CREATE_TRANSACTION_PORT_TOKEN = "CREATE_TRANSACTION_PORT_TOKEN";