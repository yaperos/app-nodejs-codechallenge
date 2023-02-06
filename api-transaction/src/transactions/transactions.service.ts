import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from './transactions.entity';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionRequest } from './DTO/create-transactions.dto';
import { TransactionCreatedEvent } from './events/transaction-created.event';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionRepository: Repository<Transactions>,

    @Inject('ANTIFRAUD_SERVICE') private readonly antifraudClient: ClientKafka,
  ) {}

  async createTransaction(transaction: CreateTransactionRequest) {
    const newTransaction = this.transactionRepository.create(transaction);
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      amount,
      transactionId,
    } = await this.transactionRepository.save(newTransaction);
    this.antifraudClient.emit(
      'transaction_created',
      new TransactionCreatedEvent(
        transactionId,
        accountExternalIdDebit,
        accountExternalIdCredit,
        tranferTypeId,
        amount,
      ),
    );
  }
}
