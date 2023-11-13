import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { KafkaService } from './kafka/kafka.service';
import { CLIENT_KAFKA, GROUP_KAFKA, MESSAGE, TOPICS } from './app.constants';
import { DataTransaction } from './interfaces/transaction.interface';

@Injectable()
export class AppService {
  constructor() {}

  validateFraud(value: number): boolean {
    const isValid = value <= 1000;
    return isValid;
  }

  sendEventStatus(status: boolean, data_event: DataTransaction) {
    console.log('data_event', data_event);
    const kafka = new KafkaService({
      clientId: CLIENT_KAFKA.ID,
      brokers: [process.env.KAFKA_URL],
      groupId: GROUP_KAFKA.ID,
    });
    const body = { status, data_transaction: data_event };
    if (status) {
      return kafka.sendMessage(TOPICS.APPROVED_TRANSACTION, {
        body,
        messageId: randomUUID(),
        messageType: MESSAGE.APPROVED_TRANSACTION,
        topicName: TOPICS.APPROVED_TRANSACTION,
      });
    }
    return kafka.sendMessage(TOPICS.REJECTED_TRANSACTION, {
      body,
      messageId: randomUUID(),
      messageType: MESSAGE.REJECTED_TRANSACTION,
      topicName: TOPICS.REJECTED_TRANSACTION,
    });
  }
}
