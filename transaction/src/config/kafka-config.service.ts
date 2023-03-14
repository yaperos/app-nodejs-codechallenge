import { DynamicModule } from '@nestjs/common';
import {
  MicroserviceOptions,
  Transport,
  ClientsModule,
} from '@nestjs/microservices';

export class KafkaConfigService {
  static connectKafka(app): void {
    const KAFKA_BROKER = process.env.KAFKA_BROKER_HOST
      ? `${process.env.KAFKA_BROKER_HOST}:${process.env.KAFKA_BROKER_PORT}`
      : null;
    app.connectMicroservice({
      transport: Transport.KAFKA,
      options: {
        subscribe: {
          fromBeginning: true,
        },
        consumer: {
          groupId: process.env.KAFKA_GROUP_ID || 'kafka-consumer',
        },
        client: {
          brokers: [KAFKA_BROKER || 'localhost:9092'],
        },
      },
    } as MicroserviceOptions);
  }

  static registerModuleKafka(): DynamicModule {
    const KAFKA_BROKER = process.env.KAFKA_BROKER_HOST
      ? `${process.env.KAFKA_BROKER_HOST}:${process.env.KAFKA_BROKER_PORT}`
      : null;
    return ClientsModule.register([
      {
        name: process.env.KAFKA_NAME_MODULE || 'kafka',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [KAFKA_BROKER || 'localhost:9092'],
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID || 'kafka-consumer',
          },
        },
      },
    ]);
  }
}
