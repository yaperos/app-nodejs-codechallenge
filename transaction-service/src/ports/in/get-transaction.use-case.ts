import { Transaction } from '@domain/transaction';

export interface GetTransactionUseCase {
  execute(transactionExternalId: string): Promise<Transaction>;
}
