import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../../database/entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionDBService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(transaction: Transaction): Promise<Transaction> {
    return await this.transactionRepository.save(transaction);
  }

  async updateTransactionByCriteria(
    criteria: Partial<Transaction>,
    toUpdate: Partial<Transaction>,
  ) {
    await this.transactionRepository.update(criteria, toUpdate);
  }

  async findTransactionByExternalId(
    transactionExternalId: string,
  ): Promise<Transaction> {
    return await this.transactionRepository.findOne({
      where: {
        transactionExternalId,
      },
    });
  }
}
