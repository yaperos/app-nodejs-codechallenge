import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly model: Model<Transaction>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return await this.model.create(createTransactionDto);
  }

  async findAll(): Promise<Transaction[]> {
    return await this.model.find({});
  }

  async findOne(transactionId: string): Promise<Transaction | null> {
    const transaction = await this.model.findById(transactionId);
    if (!transaction) {
      return null;
    }
    return transaction;
  }

  async remove(transactionId: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: transactionId });
    return result.deletedCount > 0;
  }
}
