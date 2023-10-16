import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionDbService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.save(transaction);
  }

  async updateTransactionStatus(
    requestId: string,
    status: Partial<Transaction>,
  ): Promise<UpdateResult> {
    return this.transactionRepository.update({ requestId }, status);
  }

  async getTransactionStatus(requestId: string): Promise<Transaction> {
    return this.transactionRepository.findOne({ where: { requestId } });
  }
}
