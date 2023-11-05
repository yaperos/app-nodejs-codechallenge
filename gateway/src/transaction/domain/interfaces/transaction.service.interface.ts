import { DomainCreateTransactionDto } from '../dto/transaction.create.dto';
import { Transaction } from '../entities/transaction.type';

export interface TransactionServiceInterface {
  create(transaction: DomainCreateTransactionDto);

  getById(id: number): Promise<Transaction>;
}
