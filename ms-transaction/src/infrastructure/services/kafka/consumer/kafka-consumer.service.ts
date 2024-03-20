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
        clientId: 'antifraud',
        brokers: [process.env.KAFKA_BROKER, 'localhost:9092'],
      },
      producer: {
        allowAutoTopicCreation: true,
      },
    });
  }

  onModuleDestroy() {
    this.close();
  }
}
