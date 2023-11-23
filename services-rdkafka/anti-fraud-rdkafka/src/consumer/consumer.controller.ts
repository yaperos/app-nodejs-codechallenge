import { Controller } from '@nestjs/common';
import { KafkaPayload, Subscribe, KafkaService } from '@yape/kafka';
import { Producer } from 'node-rdkafka';

import { log } from 'console';

@Controller()
export class ConsumerController {
  producer: Producer;

  constructor(private readonly kafkaService: KafkaService) {
    this.producer = this.kafkaService.getProducer();
  }
  @Subscribe('transactions')
  async handleTransactions(message: KafkaPayload) {
    log(`Received message: ${JSON.stringify(message)}`);
    // let value: any;
    // if (message.value < 1000) {
    //   log('Transaction approved');
    //   value = {
    //     ...message,
    //     approved: true,
    //   };
    // } else {
    //   log('Transaction rejected');
    //   value = {
    //     ...message,
    //     approved: false,
    //   };
    // }
    // return { value };
    const value = Buffer.from(JSON.stringify(message));
    this.producer.produce('transactions.reply', -1, value, 'reply');
  }
}
