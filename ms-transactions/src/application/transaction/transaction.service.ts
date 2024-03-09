import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionInterface } from 'src/domain/transaction/transaction.model';
import { Transactions } from 'src/infraestructure/database/models/transactions';
import { Repository } from 'typeorm';
import { DbError } from '../errors/database.error';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transactions)
    private transactionRepository: Repository<Transactions>,
  ) {}

  async createTransaction(trx: TransactionInterface): Promise<void> {
    try {
      await this.transactionRepository.save(trx);
    } catch (error) {
      throw new DbError(error, 'createTransaction');
    }
  }
}
