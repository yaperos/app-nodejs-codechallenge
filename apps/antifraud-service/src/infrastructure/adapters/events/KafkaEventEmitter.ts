import { Producer } from 'node-rdkafka';

import { EventEmitter, Transaction } from '../../../core/domain';

type KafkaEventEmitterTopics = {
  approvedTransactionTopic: string;
  rejectedTransactionTopic: string;
};

export class KafkaEventEmitter implements EventEmitter {
  constructor(
    private readonly kafkaProducer: Producer,
    private readonly topics: KafkaEventEmitterTopics,
  ) {}

  sendApprovedTransactionEvent(transaction: Transaction): void {
    this.kafkaProducer.produce(
      this.topics.approvedTransactionTopic,
      null,
      Buffer.from(JSON.stringify({ id: transaction.id })),
      `approved_transaction:${transaction.id}`,
      Date.now(),
    );
  }

  sendRejectedTransactionEvent(
    transaction: Transaction,
    errorMessage: string,
  ): void {
    this.kafkaProducer.produce(
      this.topics.rejectedTransactionTopic,
      null,
      Buffer.from(JSON.stringify({ errorMessage, id: transaction.id })),
      `rejected_transaction:${transaction.id}`,
      Date.now(),
    );
  }
}
