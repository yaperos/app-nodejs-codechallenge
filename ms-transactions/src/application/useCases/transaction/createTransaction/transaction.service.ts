import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionInterface } from '../../../../domain/transaction/transaction.model';
import { Transactions } from '../../../../infraestructure/database/models/transactions';
import { Repository } from 'typeorm';
import { DbError } from '../../../errors/database.error';
import { msConfig } from '../../../../infraestructure/config';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    @InjectRepository(Transactions)
    private transactionRepository: Repository<Transactions>,
    @Inject(msConfig.nameTransactions)
    private readonly clientKafka: ClientKafka,
  ) {}

  onModuleInit() {
    this.clientKafka.subscribeToResponseOf(
      `${msConfig.nameTransactions}-update-transaction-accepted`,
    );
    this.clientKafka.subscribeToResponseOf(
      `${msConfig.nameTransactions}-update-transaction-rejected`,
    );
  }

  async createTransaction(trx: TransactionInterface): Promise<void> {
    try {
      await this.transactionRepository.save(trx);
    } catch (error) {
      throw new DbError(error, 'createTransaction');
    }
  }

  async updateTransaction(trx: TransactionInterface): Promise<void> {
    try {
      await this.transactionRepository.update(
        { transactionExternalId: trx.transactionExternalId },
        trx,
      );
    } catch (error) {
      throw new DbError(error, 'getTransactionByTransactionExternalId');
    }
  }
}
