import { Module } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { KafkaClient } from './kafka-client.service';
import { Kafka } from 'kafkajs'; 

@Module({
  imports: [],
  providers: [AntiFraudService,
      {
        provide: 'KAFKA_CLIENT',
        useClass: KafkaClient,
      },
      {
        provide: 'KAFKA_SERVICE',
        useFactory: () => {
          return new Kafka({
            clientId: 'transaction',
            brokers: ['kafka:29092'],
            connectionTimeout: 10000,
          });
        },
      },
    ],
})
export class AntiFraudModule {}
