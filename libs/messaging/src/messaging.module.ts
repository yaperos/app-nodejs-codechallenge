import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConsumerService } from './kafka-consumer.service';
import { KafkaProducerService } from './kafka-producer.service';
import { KAFKA_OPTIONS, KafkaOptions } from './kafka.config';

@Module({})
export class MessagingModule {
  static forRoot(clientId: string): DynamicModule {
    return {
      module: MessagingModule,
      global: true,
      providers: [
        {
          provide: KAFKA_OPTIONS,
          inject: [ConfigService],
          useFactory: (config: ConfigService): KafkaOptions => ({
            clientId,
            brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(','),
          }),
        },
        KafkaProducerService,
        KafkaConsumerService,
      ],
      exports: [KafkaProducerService, KafkaConsumerService],
    };
  }
}
