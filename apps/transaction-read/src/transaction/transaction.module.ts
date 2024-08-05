import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TRANSACTION_KAFKA_CLIENT } from '@app/common';
import { TransactionReadResolver } from './api/transaction-read.resolver';
import { TransactionRepository } from './infrastructure/repositories/transaction.repository';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionCreatedHandler } from './application/events/transaction-created.handler';
import { TransactionConsumerController } from './infrastructure/kafka/consumers/transaction-consumer.controller';
import { SearchTransactionHandler } from './application/queries/search-transaction/search-transaction.handler';
import { TransactionStatusUpdatedHandler } from './application/events/transaction-updated.handler';

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
              clientId: configService.get('TRANSACTION_READ_CLIENT'),
              brokers: [configService.get('BROKERS')],
            },
            consumer: {
              groupId: configService.get('TRANSACTION_READ_CONSUMER'),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [TransactionConsumerController],
  providers: [
    TransactionReadResolver,
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
    TransactionCreatedHandler,
    SearchTransactionHandler,
    TransactionStatusUpdatedHandler,
  ],
})
export class TransactionModule {}
