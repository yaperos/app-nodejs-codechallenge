import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionRequest } from './create-transaction.dto';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionCreatedEvent } from './transaction-created.event';
import { EntityManager, Repository } from 'typeorm';
import { Transactions } from './transactions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { config } from './../config';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('ANTIFRAUD_SERVICE')
    private readonly antifraudClient: ClientKafka,
    @InjectRepository(Transactions)
    private repository: Repository<Transactions>,
    private readonly entityManager: EntityManager,
  ) {}

  createTransaction(request: CreateTransactionRequest) {
    const record = {
      accountExternalIdDebit: request.accountExternalIdDebit,
      accountExternalIdCredit: request.accountExternalIdCredit,
      transferTypeId: request.transferTypeId,
      transactionStatus: process.env.CREATED_STATUS,
      transactionExternalId: uuidv4(),
      value: request.value,
      created: new Date(),
    };

    this.antifraudClient.emit(config.topic, {
      key: config.key,
      value: record,
    });

    this.saveTransaction(record);
  }

  async handleTransactionCreated(event: TransactionCreatedEvent) {
    const record: Transactions = await this.entityManager
      .createQueryBuilder(Transactions, 'transactions')
      .where('transactions.transactionExternalId = :transactionExternalId', {
        transactionExternalId: event.transactionExternalId,
      })
      .getOne();
    if (event.transactionStatus === config.approved_status) {
      record.setTransactionStatus('transaction_approved');
    } else if (event.transactionStatus === config.rejected_status) {
      record.setTransactionStatus('transaction_rejected');
    }
    await this.repository.save(record);
  }

  saveTransaction = (record) => {
    const transactionEntity = new Transactions();
    transactionEntity.setCreatedAt(new Date());
    transactionEntity.setTransactionStatus(process.env.PENDING_STATUS);
    transactionEntity.setTransactionType('transfer');
    transactionEntity.setTransactionExternalId(record.transactionExternalId);
    transactionEntity.setValue(record.value);
    this.repository.save(transactionEntity);
  };
}
