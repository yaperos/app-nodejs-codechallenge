import {
  VerifyTransactionPublisher,
  TransactionErrorPublisher,
} from '@yape-challenge/kafka';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import {
  CreateTransactionDto,
  RetryTransactionDto,
  UpdateTransactionStatusDto,
} from '../dtos/create-transaction.dto';
import { Transaction, TransactionStatus } from '../entities/transaction.entity';
import { ConfigEnv } from 'src/config';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  /**
   * Processes a new transaction request.
   *
   * @param {CreateTransactionDto} transaction - The transaction data to be processed.
   * @returns {Promise<void>}
   * @async
   */
  async processTransactionRequest(transaction: CreateTransactionDto) {
    let transactionExists: Transaction | null = null;
    try {
      const newTransaction = this.transactionsRepository.create(transaction);
      newTransaction.status = TransactionStatus.PENDING;

      transactionExists =
        await this.transactionsRepository.save(newTransaction);
      this.randomFailure();
      await VerifyTransactionPublisher.publish({
        transactionId: transactionExists.id,
        value: transactionExists.value,
      });
    } catch (error) {
      console.error('Error processing transaction request', {
        error,
        transaction,
      });

      if (transactionExists?.id) {
        await this.handleTransactionError(transactionExists.id, error);
        return;
      }
      if (transaction.correlationId) {
        await this.handleUnrecordedTransactions(transaction, error);
        return;
      }
    }
  }

  /**
   * Processes a transaction retry.
   *
   * @param {RetryTransactionDto} transaction - The transaction data for the retry.
   * @returns {Promise<void>}
   * @async
   */
  async processTransactionRetry(transaction: RetryTransactionDto) {
    try {
      console.log('Processing transaction retry', { transaction });
      const transactionExists = await this.transactionsRepository.findOne({
        where: {
          id: transaction.transactionId,
          status: TransactionStatus.PENDING,
        },
      });

      if (!transactionExists) {
        console.log(
          `Transaction ${transaction.transactionId} not found or not in PENDING status.`,
        );
        return;
      }
      this.randomFailure();
      await VerifyTransactionPublisher.publish({
        transactionId: transactionExists.id,
        value: transactionExists.value,
      });
    } catch (error) {
      console.error('Error processing transaction retry', {
        error,
        transactionId: transaction.transactionId,
      });

      await this.handleTransactionError(transaction.transactionId, error);
    }
  }

  /**
   * Updates the status of a transaction.
   *
   * @param {UpdateTransactionStatusDto} updateTransactionStatusDto - The DTO containing transaction ID and the new status.
   * @returns {Promise<void>}
   * @async
   */
  async processTransactionStatus({
    transactionId: id,
    status,
  }: UpdateTransactionStatusDto) {
    try {
      await this.transactionsRepository.update(id, {
        status: status.toLowerCase(),
      });
    } catch (error) {
      console.error('Error processing transaction status', {
        error,
        transactionId: id,
        status,
      });
      await this.handleTransactionError(id, error);
    }
  }

  /**
   * Handles errors related to a transaction by publishing them.
   *
   * @param {string} transactionId - The ID of the transaction.
   * @param {any} error - The error object.
   * @returns {Promise<void>}
   * @private
   * @async
   */
  private async handleTransactionError(transactionId: string, error: any) {
    try {
      await TransactionErrorPublisher.publish({
        errorType: 'transaction',
        reportedBy: 'ms-transaction',
        transactionId,
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
      });
    } catch (publishError) {
      console.error('Failed to publish transaction error', {
        transactionId,
        error: publishError,
      });
    }
  }

  /**
   * Handles errors for unrecorded transactions by publishing them.
   *
   * @param {CreateTransactionDto} transaction - The transaction data.
   * @param {any} error - The error object.
   * @returns {Promise<void>}
   * @private
   * @async
   */
  private async handleUnrecordedTransactions(
    transaction: CreateTransactionDto,
    error: any,
  ) {
    try {
      await TransactionErrorPublisher.publish({
        errorType: 'unrecordedTransaction',
        reportedBy: 'ms-transaction',
        correlationId: transaction.correlationId,
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
        unrecordedTransaction: transaction,
      });
    } catch (publishError) {
      console.error('Failed to publish unrecorded transaction error', {
        correlationId: transaction.correlationId,
        error: publishError,
      });
    }
  }

  /**
   * Simulates random failures based on a configured probability, used for testing purposes.
   *
   * @private
   */
  randomFailure() {
    if (!ConfigEnv.generateError) return;
    // probability debe estar entre 0 y 1, donde 1 es 100% de probabilidad de fallo
    if (Math.random() < ConfigEnv.probabilityOfError) {
      throw new Error('Automatically generated error for testing purposes');
    }
  }
}
