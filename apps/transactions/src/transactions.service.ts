import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createTransaction(createTransaction: CreateTransactionDto) {
    return await this.transactionRepository.save(createTransaction);
  }
}
