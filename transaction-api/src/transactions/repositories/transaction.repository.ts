import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Pool } from 'pg';
import { TransactionFull } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  private pool: Pool;

  constructor(@Inject('DATABASE_CONFIG') private databaseConfig: any) {
    this.pool = new Pool(databaseConfig);
  }

  async createTransaction(
    createTransaction: TransactionFull,
  ): Promise<TransactionFull> {
    const query = `
      INSERT INTO transactions (transaction_external_id, account_external_id_debit, account_external_id_credit, transfer_type_id, value, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      createTransaction.transactionExternalId,
      createTransaction.accountExternalIdDebit,
      createTransaction.accountExternalIdCredit,
      createTransaction.transferTypeId,
      createTransaction.value,
      createTransaction.status,
      createTransaction.createdAt,
    ];

    const client = await this.pool.connect();
    try {
      const result = await client.query(query, values);

      const snakeCaseTransaction = result.rows[0];

      const transaction: TransactionFull = new TransactionFull(
        snakeCaseTransaction.transaction_external_id,
        snakeCaseTransaction.account_external_id_debit,
        snakeCaseTransaction.account_external_id_credit,
        snakeCaseTransaction.transfer_type_id,
        snakeCaseTransaction.value,
        snakeCaseTransaction.status,
        snakeCaseTransaction.created_at,
      );

      return transaction;
    } catch (error) {
      throw new HttpException(
        'Error creating transaction: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      client.release();
    }
  }

  async retrieveTransactionById(id: string): Promise<TransactionFull | null> {
    const query = `
      SELECT * FROM transactions WHERE transaction_external_id = $1
    `;
    const values = [id];

    const client = await this.pool.connect();
    try {
      const result = await client.query(query, values);

      const snakeCaseTransaction = result.rows[0];

      const transaction: TransactionFull = new TransactionFull(
        snakeCaseTransaction.transaction_external_id,
        snakeCaseTransaction.account_external_id_debit,
        snakeCaseTransaction.account_external_id_credit,
        snakeCaseTransaction.transfer_type_id,
        snakeCaseTransaction.value,
        snakeCaseTransaction.status,
        snakeCaseTransaction.created_at,
      );

      return transaction || null;
    } catch (error) {
      throw new HttpException(
        'Error retriving transaction' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      client.release();
    }
  }

  async updateTransactionStatus(
    transactionId: string,
    newStatus: string,
  ): Promise<TransactionFull> {
    const query = `
      UPDATE transactions
      SET status = $1
      WHERE transaction_external_id = $2
      RETURNING *
    `;
    const values = [newStatus, transactionId];

    const client = await this.pool.connect();
    try {
      const result = await client.query(query, values);

      const snakeCaseTransaction = result.rows[0];

      const transaction: TransactionFull = new TransactionFull(
        snakeCaseTransaction.transaction_external_id,
        snakeCaseTransaction.account_external_id_debit,
        snakeCaseTransaction.account_external_id_credit,
        snakeCaseTransaction.transfer_type_id,
        snakeCaseTransaction.value,
        snakeCaseTransaction.status,
        snakeCaseTransaction.created_at,
      );

      return transaction;
    } catch (error) {
      throw new HttpException(
        'Error updating transaction ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      client.release();
    }
  }
}
