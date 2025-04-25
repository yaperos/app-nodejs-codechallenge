import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../domain/transaction.entity';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async saveTransaction(transaction: Transaction): Promise<Transaction> {
    return this.save(transaction);
  }

  async findTransactionById(id: string): Promise<Transaction | null> {
    return this.findOne({ where: { id } });
  }
}
