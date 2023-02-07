import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from './transactions.entity';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionRequest } from './DTO/create-transactions.dto';
import { TransactionCreatedEvent } from './events/transaction-created.event';
import { UpdateTransactionRequest } from './DTO/update-transaction.dto';

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
      status,
      createdAt,
    } = await this.transactionRepository.save(newTransaction);

    this.antifraudClient
      .send(
        'transaction_created',
        new TransactionCreatedEvent(
          transactionId,
          accountExternalIdDebit,
          accountExternalIdCredit,
          tranferTypeId,
          amount,
          status,
          createdAt,
        ),
      )
      .subscribe((transactionData) => {
        this.updateTransaction(transactionData.transactionId, transactionData);
        console.log(
          `Transaction updated successfully ${transactionData.transactionId}`,
        );
      });

    return {
      transactionExternalId: transactionId,
      transactionType: { name: 'YAPE VALIDATION' },
      transactionStatus: { name: status },
      amount,
      createdAt,
    };
  }

  async getTransaction(transactionId: number) {
    return this.transactionRepository.findOne({
      where: {
        transactionId,
      },
    });
  }

  async updateTransaction(
    transactionId: number,
    upTransaction: UpdateTransactionRequest,
  ) {
    upTransaction.transactionId = transactionId;
    return this.transactionRepository.save(upTransaction);
  }
}
