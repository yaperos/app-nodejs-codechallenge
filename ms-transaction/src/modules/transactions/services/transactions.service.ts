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

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async processTransactionRequest(transaction: CreateTransactionDto) {
    let transactionExists: Transaction | null = null;
    try {
      const newTransaction = this.transactionsRepository.create(transaction);
      newTransaction.status = TransactionStatus.PENDING;

      transactionExists =
        await this.transactionsRepository.save(newTransaction);
      // throw new Error('Transaction failed');
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
      // throw new Error('Transaction failed');
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
}
