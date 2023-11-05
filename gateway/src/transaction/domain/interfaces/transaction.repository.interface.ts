import { DomainCreateTransactionDto } from '../dto/transaction.create.dto';
import { Transaction } from '../entities/transaction.type';

export interface TransactionRepositoryInterface {
  create(transaction: DomainCreateTransactionDto);

  getById(id: number): Promise<Transaction>;
}
