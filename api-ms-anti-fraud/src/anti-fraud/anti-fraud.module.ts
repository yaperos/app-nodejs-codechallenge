import { Module } from '@nestjs/common';
import { AntiFraudController } from './anti-fraud.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { ConfigModule } from '@nestjs/config';
import { AppConfiguration } from 'src/config/app.config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [
          ConfigModule.forRoot({
            load: [AppConfiguration],
          }),
        ],
        name: 'TRANSACTION_PACKAGE',
        useFactory: async () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'api-ms-transaction-client',
              brokers: [AppConfiguration().kafka_broker],
            },
            producer: {
              createPartitioner: Partitioners.DefaultPartitioner,
              allowAutoTopicCreation: true,
            },
            consumer: {
              groupId: 'api-ms-transaction-consumer',
            },
          },
        }),
      },
    ]),
  ],
  controllers: [AntiFraudController]
})
export class AntiFraudModule {}
