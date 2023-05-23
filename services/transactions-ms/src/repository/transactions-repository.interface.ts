import { Transaction } from "../domain/transaction";

export interface TransactionsRepositoryI {
  createTransaction(request: Transaction): Promise<void>;

  readTransaction(
    request: Pick<Transaction, "transactionExternalId">
  ): Promise<Transaction>;

  updateTransactionStatus(request: Transaction): Promise<void>;
}
