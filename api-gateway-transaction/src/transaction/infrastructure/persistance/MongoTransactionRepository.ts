import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/transaction/domain/TransactionRepository';
import { TransactionService } from '../transaction.service';
import { Transaction } from 'src/transaction/domain/Transaction';
import { TransactionResponse } from 'src/transaction/domain/TransactionResponse';

@Injectable()
export class MongoTransactionRepository implements TransactionRepository {
  constructor(private readonly service: TransactionService) {}

  async create(transaction: Transaction): Promise<void> {
    await this.service.create(transaction);
  }

  async getById(id: string): Promise<TransactionResponse> {
    return await this.service.findOne(id);
  }
}
