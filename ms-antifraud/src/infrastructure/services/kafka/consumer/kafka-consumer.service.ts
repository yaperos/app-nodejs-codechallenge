import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ServerKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaConsumerService
  extends ServerKafka
  implements OnModuleDestroy
{
  constructor() {
    super({
      client: {
        clientId: 'transaction',
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: 'transaction-consumer',
      },
    });
  }

  onModuleDestroy() {
    this.close();
  }
}
