import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Transaction } from './entities/transaction.entity';
import { TransactionState } from './entities/transaction.state.entity';

@Injectable()
export class TransactionStateService {
  constructor(
    @InjectModel(TransactionState.name)
    private readonly model: Model<TransactionState>,
  ) {}

  async create(
    transaction: Transaction,
    transactionType: string,
    transactionStatus: string,
  ): Promise<TransactionState> {
    return await this.model.create({
      createdAt: new Date(),
      transactionId: transaction.id,
      value: transaction.value,
      transactionType: { name: transactionType },
      transactionStatus: { name: transactionStatus },
    });
  }

  async findAll(transactionId: string): Promise<Transaction[]> {
    return await this.model.find({ transactionId });
  }

  async remove(transactionId: string): Promise<boolean> {
    const result = await this.model.deleteOne({ transactionId });
    return result.deletedCount > 0;
  }
}
