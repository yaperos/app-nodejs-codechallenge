
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ANTIFRAUD_KAFKA_CLIENT, KAFKA_TOPIC_TRANSACTION_DEBEZIUM } from '../shared/constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ANTIFRAUD_KAFKA_CLIENT,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('app.kafka.clientId') || 'default-client-id',
              brokers: [configService.get<string>('app.kafka.broker') || 'kafka:9092'],
            },
            consumer: {
              allowAutoTopicCreation: true,
              groupId: configService.get<string>('app.kafka.consumerGroupId') || 'antifraud-debezium-consumer-group',
            },
            producer: {
              allowAutoTopicCreation: true,
            },
            subscribe: {
              fromBeginning: false,
              topics: [
                KAFKA_TOPIC_TRANSACTION_DEBEZIUM
              ]
            }
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule { }