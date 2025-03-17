import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerInfrastructure } from '../infrastructure/stream/consumer.infrastructure';
import { ProducerInfrastructure } from '../infrastructure/stream/producer.infrastructure';
import { TransactionEvent } from '../domain/entities/transaction.event';
import { topicTypes, transactionStatus } from '../shared/constants';

@Injectable()
export class AntiFraudService implements OnModuleInit {
  constructor(
    @Inject('IConsumer') private readonly consumer: ConsumerInfrastructure,
    @Inject('IProducer') private readonly producer: ProducerInfrastructure,
  ) {}

  async onModuleInit() {
    await this.consumer.consume(
      { topics: [topicTypes.transactionPending] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const eventValidated = this.validateAmount(
            JSON.parse(message.value!.toString()),
          );
          await this.publishTransaction(eventValidated);
        },
      },
    );
  }
  private validateAmount(transactionEvent: TransactionEvent) {
    transactionEvent.transactionStatus.name = transactionStatus.approved;
    if (transactionEvent.value > 1000) {
      transactionEvent.transactionStatus.name = transactionStatus.rejected;
    }
    return transactionEvent;
  }
  private async publishTransaction(data: TransactionEvent) {
    const event = {
      topic: topicTypes.transactionApproved,
      messages: [
        {
          value: JSON.stringify(data),
        },
      ],
    };
    if (data.transactionStatus.name == transactionStatus.rejected)
      event.topic = topicTypes.transactionRejected;
    await this.producer.produce(event);
  }
}
