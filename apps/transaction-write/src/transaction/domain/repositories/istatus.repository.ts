import { TransactionStatus } from '../entities/status.entity';

export interface ITransactionStatusRepository {
  findById(id: number): Promise<TransactionStatus>;
}
