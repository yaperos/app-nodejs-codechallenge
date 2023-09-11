import { Observable } from 'rxjs';
import { TransactionCache } from '../infraestructure/caching/transaction-cache'

export type SyncPaginate<T> = { data: T[]; page: number; total_pages: number; total_elements: number };

//Usa los mismos modelos de cache por ser soporte cuando falle el cache
export interface SyncApiService {
  getTransactionDetail$(id: string): Observable<TransactionCache>;
  getTransactionDetail$(transaction: TransactionCache): Observable<TransactionCache>;
}
