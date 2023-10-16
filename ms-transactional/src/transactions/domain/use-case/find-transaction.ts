import { Transaction } from '../entity/transaction';

export interface FindTransaction {
  execute(transactionId: string): Promise<Transaction>;
}
