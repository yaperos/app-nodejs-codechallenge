import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Transaction } from '../entities/Transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  findOneById(id: string) {
    return this.transactionRepository.findOne({
      where: { id },
      relations: ['transactionStatus', 'transferType'],
    });
  }
}
