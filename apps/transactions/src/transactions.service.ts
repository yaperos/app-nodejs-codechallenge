import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transactions.entity';
import { CreateTransactionDTO } from './dtos/create-transaactions.dto';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionCreatedEvent } from './transaction-created.event';

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
    this.transactionRepository.save(newTransaction);
    this.transactionsClient.emit(
      'transaction_created',
      new TransactionCreatedEvent(
        newTransaction.id,
        newTransaction.status,
        newTransaction.amount,
      ),
    );
    return transaction;
  }
}
