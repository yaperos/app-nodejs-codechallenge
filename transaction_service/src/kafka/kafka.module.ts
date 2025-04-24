import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KAFKA_TOPIC_TRANSACTION_DEBEZIUM, KAFKA_TOPIC_TRANSACTION_VALIDATED, TRANSACTION_SERVICE_KAFKA_CLIENT } from '../shared/constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: TRANSACTION_SERVICE_KAFKA_CLIENT,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('app.kafka.clientId') || 'default-client-id',
              brokers: [configService.get<string>('app.kafka.broker') || 'localhost:9092'],
            },
            consumer: {
              allowAutoTopicCreation: true,
              groupId: configService.get<string>('app.kafka.consumerGroupId') || 'default-consumer-group',
            },
            subscribe: {
              fromBeginning: false,
              topics: [
                KAFKA_TOPIC_TRANSACTION_DEBEZIUM,
                KAFKA_TOPIC_TRANSACTION_VALIDATED,
              ]
            }
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule], // Export so other modules can inject the Kafka client
})
export class KafkaModule { }