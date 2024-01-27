import {
  VerifyTransactionPublisher,
  TransactionErrorPublisher,
} from '@yape-challenge/kafka';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import {
  CreateTransactionDto,
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
      }
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
}
