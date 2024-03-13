import { TransactionFilterInput } from '../createTransaction/transaction.model';

export interface TransactionResolverInterface {
  getTransactions(filter: TransactionFilterInput): Promise<any>;
}
