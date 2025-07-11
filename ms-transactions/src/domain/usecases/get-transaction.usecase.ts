import { Transaction } from '../entities/transaction';

export interface GetTransactionUseCase {
  execute(transactionId: string): Promise<Transaction>;
}
