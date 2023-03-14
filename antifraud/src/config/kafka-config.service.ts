import { DynamicModule } from '@nestjs/common';
import {
  MicroserviceOptions,
  Transport,
  ClientsModule,
} from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

export class KafkaConfigService {
  static connectKafka(app): void {
    app.connectMicroservice({
      transport: Transport.KAFKA,
      options: {
        subscribe: {
          fromBeginning: true,
        },
        consumer: {
          groupId: `antifraud-service.${uuidv4()}`,
        },
        client: {
          brokers: [`${process.env.KAFKA_BROKER_HOST}:${process.env.KAFKA_BROKER_PORT}` || 'localhost:9092'],
        },
      },
    } as MicroserviceOptions);
  }

  static registerModuleKafka(): DynamicModule {
    return ClientsModule.register([
      {
        name: process.env.KAFKA_NAME_MODULE || 'kafka',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [`${process.env.KAFKA_BROKER_HOST}:${process.env.KAFKA_BROKER_PORT}` || 'localhost:9092'],
          },
          consumer: {
            groupId: `antifraud-service.${uuidv4()}`,
          },
        },
      },
    ]);
  }
}
