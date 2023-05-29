import { TransactionStatus } from 'src/modules/transactions/services/transactions.service';

export interface ITransactionsService {
  sendTransactionToKafka(
    transactionId: string,
    status: TransactionStatus,
    topic: string,
  ): Promise<void>;
  rejectTransaction(transactionId: string): Promise<void>;
  approveTransaction(transactionId: string): Promise<void>;
}
