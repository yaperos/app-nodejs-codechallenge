import { Observable } from 'rxjs';
import { TransactionCache } from '../infraestructure/caching/transaction-cache'


export interface CachingService {
  getTransactionDetail$(id: string): Observable<TransactionCache>;
  setTransactionDetail$(transaction: TransactionCache);
}
