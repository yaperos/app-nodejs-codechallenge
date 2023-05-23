import { eq } from "drizzle-orm";
import { type drizzle } from "drizzle-orm/postgres-js";
import { Transaction } from "../domain/transaction";
import { transactionsTable } from "./transactions-database";
import { TransactionsRepositoryI } from "./transactions-repository.interface";

export type TransactionsRepositoryProps = {
  postgresClient: ReturnType<typeof drizzle>;
};

export class TransactionsRepository implements TransactionsRepositoryI {
  constructor(private props: TransactionsRepositoryProps) {}

  async createTransaction(request: Transaction): Promise<void> {
    await this.props.postgresClient.insert(transactionsTable).values({
      transactionExternalId: request.transactionExternalId,
      transactionTypeName: request.transactionType.name,
      transactionStatusName: request.transactionStatus.name,
      value: String(request.value),
      createdAt: request.createdAt ?? new Date(),
    });
  }

  async readTransaction(
    request: Pick<Transaction, "transactionExternalId">
  ): Promise<Transaction> {
    const [transactionDb] = await this.props.postgresClient
      .select()
      .from(transactionsTable)
      .where(
        eq(
          transactionsTable.transactionExternalId,
          request.transactionExternalId
        )
      );

    if (!transactionDb) {
      throw new Error("Transaction not found");
    }

    return new Transaction({
      transactionExternalId: transactionDb.transactionExternalId,
      transactionType: {
        name: transactionDb.transactionTypeName,
      },
      transactionStatus: {
        name: transactionDb.transactionStatusName,
      },
      value: Number(transactionDb.value),
      createdAt: transactionDb.createdAt,
    });
  }

  async updateTransactionStatus(request: Transaction): Promise<void> {
    await this.props.postgresClient
      .update(transactionsTable)
      .set({
        transactionStatusName: request.transactionStatus.name,
        updatedAt: new Date(),
      })
      .where(
        eq(
          transactionsTable.transactionExternalId,
          request.transactionExternalId
        )
      );
  }
}
