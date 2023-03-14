import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionDocument } from 'src/domain/models';
import { ITransactionRepository } from 'src/domain/ports';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectModel('TRANSACTION')
    private readonly Transaction: Model<TransactionDocument>,
  ) {}
  async findAll(): Promise<TransactionDocument[]> {
    return await this.Transaction.find();
  }
}
