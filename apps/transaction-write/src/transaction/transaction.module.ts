import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TRANSACTION_KAFKA_CLIENT } from '@app/common';
import { TransactionResolver } from './api/transaction.resolver';
import { TransactionRepository } from './infrastructure/repositories/transaction.repository';
import { TransactionStatusRepository } from './infrastructure/repositories/status.repository';
import { TransactionTypeRepository } from './infrastructure/repositories/transaction-type.repository';
import { CreateTransactionHandler } from './application/commands/create-transaction/create-transaction.handler';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionStatusUpdatedHandler } from './application/events/transaction-status-updated.handler';
import { TransactionConsumerController } from './infrastructure/kafka/consumers/transaction-consumer.controller';
import { TransactionSaga } from './application/saga/transaction.saga';

@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    ClientsModule.registerAsync([
      {
        name: TRANSACTION_KAFKA_CLIENT,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get('TRANSACTION_WRITE_CLIENT'),
              brokers: [configService.get('BROKERS')],
            },
            consumer: {
              groupId: configService.get('TRANSACTION_WRITE_CONSUMER'),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [TransactionConsumerController],
  providers: [
    TransactionResolver,
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
    {
      provide: 'ITransactionStatusRepository',
      useClass: TransactionStatusRepository,
    },
    {
      provide: 'ITransactionTypeRepository',
      useClass: TransactionTypeRepository,
    },
    CreateTransactionHandler,
    TransactionStatusUpdatedHandler,
    TransactionSaga,
  ],
})
export class TransactionModule {}
