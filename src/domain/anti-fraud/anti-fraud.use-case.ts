import { Inject, Injectable } from '@nestjs/common';
import { SubscribeTo } from 'src/infra/clients/kafka/decorators/kafka.decorator';
import { KafkaPayload } from './anti-fraud.entities';
import { StatusType } from '../_shared/constants/transactions-status.enum';
import { Logger } from 'nestjs-pino';
import { AntiFraudPort } from './anti-fraud.ports';
import { KafkaTopicNamesEnum } from '../_shared/constants/kafka-topic-names.enum';
import { KafkaClient } from '../../infra/clients/kafka/kafka.client';

@Injectable()
export class AntiFraud {
  constructor(private readonly logger: Logger, private readonly antiFraudPort: AntiFraudPort) {}
  @SubscribeTo(KafkaTopicNamesEnum.KAFKA_TOPIC_TO_TRANSACTION)
  async evaluateTransaction(payload: any) {
    console.log('[KAKFA-CONSUMER] Print message after receiving', payload);
    const { body } = JSON.parse(payload);

    if (body.status.status !== StatusType.PENDING) {
      this.logger.error('Only is possible process PENDING transactions');
    }

    const transactionValue = body.value;

    const returnPayload: KafkaPayload = {
      body: {},
      messageId: new Date().toISOString(),
      messageType: 'anti.fraud.evaluated',
      topicName: '',
    };

    if (transactionValue > 1000) {
      returnPayload.body = { ...body, status: { status: StatusType.REJECTED } };
      await this.antiFraudPort.returnErrorTransactionEvaluated(returnPayload);
    } else {
      returnPayload.body = { ...body, status: { status: StatusType.APPROVED } };
      await this.antiFraudPort.returnTransactionEvaluated(returnPayload);
    }
  }
}
