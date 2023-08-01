import { DynamicModule, Module } from '@nestjs/common';
import { KafkaClient } from 'src/infra/clients/kafka/kafka.client';
import { KafkaConfig } from 'kafkajs';

@Module({})
export class KafkaModule {
  static register(kafkaConfig: KafkaConfig): DynamicModule {
    return {
      global: true,
      module: KafkaModule,
      providers: [
        {
          provide: KafkaClient,
          useValue: new KafkaClient(kafkaConfig),
        },
      ],
      exports: [KafkaClient],
    };
  }
}
