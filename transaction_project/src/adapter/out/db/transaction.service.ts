import { Injectable } from '@nestjs/common';
import { TransactionEntity } from '../../../domain/models/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Transaction } from '../../../domain/models/transaction.interface';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async create(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.save(transaction);
  }

}
