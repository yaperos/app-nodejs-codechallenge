import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction } from '../entities/transaction';

export interface CreateTransactionUseCase {
  execute(transaction: CreateTransactionDto): Promise<Transaction>;
}
