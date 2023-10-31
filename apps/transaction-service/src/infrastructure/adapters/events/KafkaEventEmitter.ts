import { Producer } from 'node-rdkafka';

import {
  CreatedTransactionEventPayload,
  EventEmitter,
} from '../../../core/domain';
import { kafkaProducer } from '../../di';

type KafkaEventEmitterTopics = {
  transactionCreatedTopic: string;
};

export class KafkaEventEmitter implements EventEmitter {
  constructor(
    private readonly kafkaProducer: Producer,
    private readonly topics: KafkaEventEmitterTopics,
  ) {}
  async sendCreatedTransactionEvent(
    payload: CreatedTransactionEventPayload,
  ): Promise<void> {
    await kafkaProducer.produce(
      this.topics.transactionCreatedTopic,
      null,
      Buffer.from(JSON.stringify(payload)),
      `created_transaction:${payload.id}`,
      Date.now(),
    );
  }
}
