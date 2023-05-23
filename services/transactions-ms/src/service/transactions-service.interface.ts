import { Antifraud } from "../domain/antifraud";
import { Transaction } from "../domain/transaction";

export interface TransactionsServiceI {
  createTransaction(request: Transaction): Promise<Transaction>;

  readTransaction(
    request: Pick<Transaction, "transactionExternalId">
  ): Promise<Transaction>;

  processTransactionUpdateEvent(request: Antifraud): Promise<Transaction>;
}
