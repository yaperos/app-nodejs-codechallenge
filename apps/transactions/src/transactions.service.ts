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

  async createTransaction(transaction: CreateTransactionDTO) {
    const newTransaction = this.transactionRepository.create(transaction);
    const newTransactionRepository = await this.transactionRepository.save(
      newTransaction,
    );
    this.transactionsClient.emit(
      'transaction_created',
      new TransactionCreatedEvent(
        newTransactionRepository.id,
        newTransactionRepository.status,
        newTransactionRepository.amount,
      ),
    );
    return transaction;
  }

  async updateTransactionStatus(transactionId: string, status: string) {
    const transactionRepository = await this.transactionRepository.update(
      transactionId,
      { status: status },
    );
    return transactionRepository;
  }
}
