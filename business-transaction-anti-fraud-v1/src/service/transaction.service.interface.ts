import { Observable } from 'rxjs';
import { RawTransaction } from '../model/raw-transaction.model';
import { ValidationResult } from '../model/validation-result.model';

/**
 * Transaction Service Interface.
 */
export interface TransactionService {
  /**
   * Analyze transaction for fraud detection
   */
  analyzeTrx(transaction: Observable<RawTransaction>): Observable<ValidationResult>;
}
