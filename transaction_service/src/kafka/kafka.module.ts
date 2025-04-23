// src/kafka/kafka.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TRANSACTION_SERVICE_KAFKA_CLIENT } from '../shared/constants'; // Create this constants file

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: TRANSACTION_SERVICE_KAFKA_CLIENT, // Injection token
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('app.kafka.clientId') || 'default-client-id',
              brokers: [configService.get<string>('app.kafka.broker') || 'localhost:9092'],
              // Add any other Kafka client options here (SSL, SASL, etc.)
            },
            consumer: {
              // Use a group ID specific to this service's role
              groupId: configService.get<string>('app.kafka.consumerGroupId') || 'default-consumer-group',
            },
            producer: {
              allowAutoTopicCreation: true, // Convenient for dev, maybe disable in prod
            }
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule], // Export so other modules can inject the Kafka client
})
export class KafkaModule { }