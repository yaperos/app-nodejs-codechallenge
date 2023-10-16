import { CreateTransactionRequestDto } from '../dto/create-transaction-request.dto';
import { Transaction } from '../entity/transaction';

export interface CreateTransaction {
  excute(dto: CreateTransactionRequestDto): Promise<Transaction>;
}
