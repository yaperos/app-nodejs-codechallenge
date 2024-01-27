import { TransactionEntity } from './Transaction.entity';

export interface TransactionRepository {
  registerTrx(trx: TransactionEntity): Promise<TransactionEntity>;
  findTrx(id: string): Promise<TransactionEntity | null>;
  updateStatus( id: string, newStatus: string ):Promise<TransactionEntity|null>;
}
