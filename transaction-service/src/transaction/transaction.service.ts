import { Outbox } from './outbox.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(private readonly datasource: DataSource) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    let transaction: Transaction;

    await this.datasource.transaction(async (manager) => {
      const transactionEntity = manager.create(
        Transaction,
        createTransactionDto,
      );
      transaction = await manager.save(Transaction, transactionEntity);

      const AGGREGATE_TYPE = 'TRANSACTION';
      const EVENT_TYPE = 'CREATED';

      const outboxEntity: Outbox = manager.create(Outbox, {
        aggregatetype: AGGREGATE_TYPE,
        aggregateid: transaction.transactionExternalId,
        eventtype: EVENT_TYPE,
        eventname: `${AGGREGATE_TYPE}.${EVENT_TYPE}`,
        payload: transaction,
      });

      await manager.save(Outbox, outboxEntity);
    });

    return transaction;
  }

  async getTransaction(id: string): Promise<Transaction> {
    return await this.datasource.getRepository(Transaction).findOneBy({
      transactionExternalId: id,
    });
  }

  async updateTransaction(data: any): Promise<void> {
    const transaction = await this.getTransaction(data.transactionExternalId);
    transaction.status = data.status;
    await this.datasource.getRepository(Transaction).save(transaction);
  }
}
