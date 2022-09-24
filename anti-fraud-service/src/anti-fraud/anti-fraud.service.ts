import { AntiFraudStatus } from './anti-fraud-status.enum';
import { Outbox } from './outbox.entity';
import { DataSource } from 'typeorm';
import { AntiFraud } from './anti-fraud.entity';
import { Injectable } from '@nestjs/common';
import { Transaction } from './dto/transaction-created.event';

@Injectable()
export class AntiFraudService {
  constructor(private readonly datasource: DataSource) {}

  async createAntiFraud(transaction: Transaction) {
    await this.datasource.transaction(async (manager) => {
      const { value, transactionExternalId } = transaction;
      const status = this.validateTransaction(value);
      const message = `The amount of ${value} was ${status}`;

      const antifraudEntity = manager.create(AntiFraud, {
        transactionExternalId,
        status,
        message,
      });
      const antifraud = await manager.save(AntiFraud, antifraudEntity);

      const AGGREGATE_TYPE = 'ANTIFRAUD';
      const EVENT_TYPE = status;

      const outboxEntity: Outbox = manager.create(Outbox, {
        aggregatetype: AGGREGATE_TYPE,
        aggregateid: antifraud.transactionExternalId,
        eventtype: EVENT_TYPE,
        eventname: `${AGGREGATE_TYPE}.${EVENT_TYPE}`,
        payload: antifraud,
      });

      await manager.save(Outbox, outboxEntity);
    });
  }

  validateTransaction(value: number): AntiFraudStatus {
    if (value > 1000) return AntiFraudStatus.REJECTED;
    return AntiFraudStatus.APPROVED;
  }
}
