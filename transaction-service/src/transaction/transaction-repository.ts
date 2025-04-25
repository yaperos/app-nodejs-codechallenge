import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { StatusTransaction } from './interfaces/status.interface';
import { TransactionType } from './entities/transaction-type.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(TransactionType)
    private transactionsTypeRepository: Repository<TransactionType>,
  ) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const newTransaction = this.transactionsRepository.create(transaction);
    return this.transactionsRepository.save(newTransaction);
  }

  async findOne(transactionExternalId: string): Promise<Transaction | null> {
    return this.transactionsRepository.findOne({
      where: { transactionExternalId },
      relations: ['transactionType'],
    });
  }

  async updateStatus(
    transactionExternalId: string,
    transactionStatus: StatusTransaction,
  ) {
    return this.transactionsRepository.update(
      { transactionExternalId },
      { transactionStatus },
    );
  }

  async getTransactionType(transactionTypeId: number) {
    return this.transactionsTypeRepository.findOne({
      where: { transactionTypeId },
    });
  }
}
