import { Module } from '@nestjs/common';
import { AntifraudConsumerController } from './infraestructure/kafka/consumers/antifraud.consumer.controller';
import { TRANSACTION_KAFKA_CLIENT } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionValidatedHandler } from './application/events/transaction-validated.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionSaga } from './application/saga/transaction.saga';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.registerAsync([
      {
        name: TRANSACTION_KAFKA_CLIENT,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get('ANTIFRAUD_CLIENT'),
              brokers: [configService.get('BROKERS')],
            },
            consumer: {
              groupId: configService.get('ANTIFRAUD_CONSUMER'),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AntifraudConsumerController],
  providers: [TransactionValidatedHandler, TransactionSaga],
})
export class AntifraudModule {}
