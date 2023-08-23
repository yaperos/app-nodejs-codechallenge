import { Observable } from 'rxjs';
import { TransactionVerify } from '../entities/transaction-verify';

export interface AntiFraudValidationRepository {
  getVerifyTransaction<T>(
    transactionVerify: TransactionVerify,
  ): Promise<Observable<T>>;
}
