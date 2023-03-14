import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ITransaction,
  TransactionDocument,
} from 'src/transaction/domain/models';
import {
  ITransactionRepository,
  TransactionKey,
} from 'src/transaction/domain/ports';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectModel(TransactionKey.TRANSACTION_SCHEMA)
    private readonly Transaction: Model<TransactionDocument>,
  ) {}
  async findAll(): Promise<TransactionDocument[]> {
    return await this.Transaction.find();
  }
  async findOne(id: string): Promise<TransactionDocument> {
    return await this.Transaction.findById(id);
  }
  async create(transaction: ITransaction): Promise<TransactionDocument> {
    return await this.Transaction.create(transaction);
  }
  async update(id: string, payload: any): Promise<any> {
    return await this.Transaction.findByIdAndUpdate(id, payload);
  }
  async delete(id: string): Promise<any> {
    return await this.Transaction.deleteOne({ id });
  }
}
