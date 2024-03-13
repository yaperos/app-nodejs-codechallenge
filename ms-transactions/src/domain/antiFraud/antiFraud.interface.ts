import { TransactionInterface } from '../transaction/createTransaction/transaction.model';

export interface AntiFraudServiceInterface {
  verifyTransaction(data: TransactionInterface): void;
}
