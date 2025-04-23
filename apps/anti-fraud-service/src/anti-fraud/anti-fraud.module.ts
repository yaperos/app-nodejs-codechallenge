import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';
import { AntiFraudController } from './anti-fraud.controller';
import { KafkaInitService } from '@app/shared';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud-service',
            brokers: process.env.KAFKA_BROKERS?.split(',') || [
              'localhost:9092',
            ],
          },
          producer: {
            allowAutoTopicCreation: true,
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
            allowAutoTopicCreation: true,
            retry: {
              retries: 10,
              initialRetryTime: 1000,
            },
          },
        },
      },
    ]),
  ],
  controllers: [AntiFraudController],
  providers: [
    AntiFraudService,
    {
      provide: KafkaInitService,
      useFactory: kafkaClient => new KafkaInitService(kafkaClient),
      inject: ['KAFKA_SERVICE'],
    },
  ],
})
export class AntiFraudModule {}
