import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isUUID } from 'class-validator';
import { Model } from 'mongoose';

import { Transaction } from './transaction.schema';
import { TransactionStatus } from '../transaction/transaction-status';

@Injectable()
export class DataBaseService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionRepository: Model<Transaction>,
  ) {}

  public async getById(id: string): Promise<Transaction> {
    let transaction;
    if (isUUID(id)) {
      transaction = await this.transactionRepository.findOne({ id: id });
    }

    if (!transaction)
      throw new NotFoundException(`Transaction with ${id} not found`);

    return transaction;
  }

  async create(transaction: Transaction): Promise<Transaction> {
    const transactionSaved = await this.transactionRepository.create(
      transaction,
    );
    return transactionSaved;
  }

  async updateTransactionStatus(
    id: string,
    status: TransactionStatus,
  ): Promise<boolean> {
    await this.transactionRepository.updateOne(
      {
        id,
      },
      {
        status,
      },
    );
    return true;
  }
}
