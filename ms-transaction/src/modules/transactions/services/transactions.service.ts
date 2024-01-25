import { TransactionPublisher } from '@yape-challenge/kafka';
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
    const newTransaction = this.transactionsRepository.create(transaction);
    newTransaction.status = TransactionStatus.PENDING;

    const newRecord = await this.transactionsRepository.save(newTransaction);

    await TransactionPublisher.publish({
      transactionId: newRecord.id,
      value: newRecord.value,
    });
  }

  async processTransactionStatus(transactionDto: UpdateTransactionStatusDto) {
    const { transactionId: id, status } = transactionDto;

    await this.transactionsRepository.update(id, {
      status: status.toLowerCase(),
    });
  }
}
