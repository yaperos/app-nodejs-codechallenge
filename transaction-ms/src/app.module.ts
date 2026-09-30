import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTransactionHandler } from './application/commands/create-transaction/create-transaction.handler';
import { UpdateTransactionStatusHandler } from './application/commands/update-transaction-status/update-transaction-status.handler';
import { GetTransactionHandler } from './application/queries/get-transaction/get-transaction.handler';
import { validateEnv } from './config/env';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { TransactionController } from './presentation/http/controllers/transaction.controller';
import { DomainExceptionFilter } from './presentation/http/filters/domain-exception.filter';
import { TransactionValidatedConsumer } from './presentation/messaging/transaction-validated.consumer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    CqrsModule.forRoot(),
    InfrastructureModule,
  ],
  controllers: [TransactionController],
  providers: [
    CreateTransactionHandler,
    UpdateTransactionStatusHandler,
    GetTransactionHandler,
    TransactionValidatedConsumer,
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
})
export class AppModule { }