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
    const record = await this.repository.findOneBy({
      transactionExternalId: event.transactionExternalId,
    });
    if (event.transactionStatus === config.approved_status) {
      record.transactionStatus = 'transaction_approved';
    } else if (event.transactionStatus === config.rejected_status) {
      record.transactionStatus = 'transaction_rejected';
    }
    await this.repository.save(record);
  }

  saveTransaction = (record) => {
    const transactionEntity = new Transactions();
    transactionEntity.createdAt = new Date();
    transactionEntity.transactionStatus = process.env.PENDING_STATUS;
    transactionEntity.transactionType = 'transfer';
    transactionEntity.transactionExternalId = record.transactionExternalId;
    transactionEntity.value = record.value;
    this.repository.save(transactionEntity);
  };
}
