/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionExternal } from "../../domain";
import { TransactionMap } from "../../mappers";
import { ITransactionRepo } from "../transactionRepo";

let transactions: { [k: string]: any } = [];

export class InMemoryTransactionRepo implements ITransactionRepo {
  exists(transactionId: string): boolean {
    const result = transactions.find((t: any) => t.id === transactionId);
    return !!result;
  }
  async save(transaction: TransactionExternal): Promise<void> {
    const transactionToPersitence = await TransactionMap.toPersistance(
      transaction
    );
    transactions.push(transactionToPersitence);
    console.log(transactions);
  }

  getTransactionById(transactionId: string): TransactionExternal {
    const result = transactions.find((t: any) => t.id === transactionId);
    return TransactionMap.toDomain(result);
  }

  async update(transaction: TransactionExternal): Promise<void> {
    const transactionToPersitence = await TransactionMap.toPersistance(
      transaction
    );
    const transactionsFiltered = transactions.filter(
      (t: any) => t.id !== transactionToPersitence.id
    );
    transactions = [...transactionsFiltered, transactionToPersitence];
    console.log(transactions);
  }
}
