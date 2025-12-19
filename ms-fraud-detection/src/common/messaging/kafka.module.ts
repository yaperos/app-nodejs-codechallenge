import { Global, Module } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'KAFKA_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const broker = config.get<string>('KAFKA_BROKER') || 'localhost:9092';

        return new Kafka({
          clientId: 'ms-fraud-detection',
          brokers: [broker],
        });
      },
    },
  ],
  exports: ['KAFKA_CLIENT'],
})
export class KafkaModule {}
