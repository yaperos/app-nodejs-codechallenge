/* Extra */
import { Observable } from 'rxjs';

/* Project */
import { Transaction } from '../models';
import { CreateTransactionInput, RetrieveTransactionInput } from '../dtos';

export interface TransactionService {
  CreateTransaction(data: CreateTransactionInput): Observable<Transaction>;
  RetrieveTransaction(data: RetrieveTransactionInput): Observable<Transaction>;
}
