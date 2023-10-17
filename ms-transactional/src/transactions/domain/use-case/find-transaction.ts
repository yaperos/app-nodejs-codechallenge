import { TransactionDto } from '../dto/transaction.dto';

export interface FindTransaction {
  execute(transactionId: string): Promise<TransactionDto>;
}
