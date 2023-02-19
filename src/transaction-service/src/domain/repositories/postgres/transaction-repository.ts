import { v4 as uuidv4 } from "uuid";
import { Pool } from "pg";
import { Status } from "../../entities/status";
import { Transaction } from "../../entities/transaction";
import { TransactionRepository } from "../ports";
import { TransactionId } from "../../entities/value-objects/transaction-id";
import { AccountExternalId } from "../../entities/value-objects/account-external-id";
import { TransferTypeId } from "../../entities/value-objects/transfer-type-id";

export class PostgresTransactionRepository implements TransactionRepository {
  constructor(private pool: Pool) {}

  async create(
    accountExternalIdDebit: AccountExternalId,
    accountExternalIdCredit: AccountExternalId,
    tranferTypeId: TransferTypeId,
    value: number
  ): Promise<Transaction> {
    const tx = new Transaction(
      new TransactionId(uuidv4()),
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
      Status.PENDING,
      new Date(),
      new Date()
    );
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        `INSERT INTO transactions (
          id,
          account_external_id_debit,
          account_external_id_credit,
          transfer_type_id,
          value,
          status,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [
          tx.id.value,
          tx.accountExternalIdDebit.value,
          tx.accountExternalIdCredit.value,
          tx.tranferTypeId.value,
          tx.value,
          tx.status,
          tx.createdAt,
          tx.updatedAt,
        ]
      );
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }

    return tx;
  }

  async getById(id: TransactionId): Promise<Transaction> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        "SELECT * FROM transactions WHERE id = $1;",
        [id.value]
      );

      if (res.rowCount > 0) {
        const row = res.rows[0];

        return new Transaction(
          new TransactionId(row.id),
          new AccountExternalId(row.account_external_id_debit),
          new AccountExternalId(row.account_external_id_credit),
          new TransferTypeId(row.transfer_type_id),
          row.value,
          row.status,
          new Date(row.created_at),
          new Date(row.updated_at)
        );
      } else {
        throw new Error("transaction not found");
      }
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async updateStatus(id: TransactionId, status: Status): Promise<void> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        "UPDATE transactions SET status = $1 WHERE id = $2;",
        [status, id.value]
      );
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
}
