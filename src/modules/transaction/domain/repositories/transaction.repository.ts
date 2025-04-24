import { Transaction } from '@/modules/transaction/domain/entities/transaction.entity';

export abstract class TransactionRepository {
  abstract findById(id: string): Promise<Transaction | null>;
  abstract save(transaction: Transaction): Promise<Transaction>;
  abstract updateStatus(id: string, statusId: number): Promise<Transaction>;
}
