import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transactions.entity';
import { CreateTransactionDTO } from './dtos/create-transaction.dto';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionsClient: ClientKafka,
  ) {}

  createTransaction(transaction: CreateTransactionDTO) {
    const newTransaction = this.transactionRepository.create(transaction);
    return this.transactionRepository.save(newTransaction);
  }
}
