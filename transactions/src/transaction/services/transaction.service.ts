import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

import { TransactionInput } from '../graphql/types';
import { TransactionStatus } from '../constants/enums';
import { Transaction } from '../entities/Transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  findOneById(id: string): Promise<Transaction> {
    return this.transactionRepository.findOne({
      where: { id },
      relations: ['transactionStatus', 'transferType'],
    });
  }

  async createTransaction(transaction: TransactionInput): Promise<Transaction> {
    const newTransaction = plainToInstance(Transaction, {
      ...transaction,
      transactionStatusId: TransactionStatus.PENDING,
    });
    const savedTransaction = await this.transactionRepository.save(
      newTransaction,
    );
    return this.findOneById(savedTransaction.id);
  }
}
