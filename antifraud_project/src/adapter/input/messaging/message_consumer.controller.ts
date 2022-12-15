import { Controller, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { AntifraudCheckPayload } from './antifraud_check.payload';

import { KafkaService } from './kafka.service';

@Controller()
export class MessageConsumerController
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly kafkaService: KafkaService) {}

  async onModuleInit() {
    console.log('MessageConsumerController::onModuleInit');

    const consumer = this.kafkaService.getConsumer();
    await consumer.connect();

    // Consumers
    console.log('MessageConsumerController - consumers');

    // Consumer for topic "antifraud-analysis-response"
    // TODO: topic to constants
    await this.kafkaService.consume(consumer, 'antifraud-check', (msg) => {
      const checkPayload: AntifraudCheckPayload = JSON.parse(
        msg.value.toString(),
      );
      console.log(
        `>> ANTIFRAUD AntifraudConsumerController: read incoming message ` +
          `${JSON.stringify(checkPayload)}`,
      );

      const transactionId : number = checkPayload.transactionId;
    });
  }

  async onModuleDestroy() {
    this.kafkaService.getConsumer().disconnect();
  }
}
