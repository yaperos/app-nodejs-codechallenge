import { Module } from '@nestjs/common';
import { TransactionResolver } from './infrastructure/graphql/transaction.resolver';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { FindTransactionUseCase } from './application/use-cases/find-transaction.use-case';
import { TransactionRepositoryImpl } from './infrastructure/prisma/transaction.repository.impl';
import { AntifraudProducer } from './infrastructure/kafka/antifraud.producer';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { RedisService } from './infrastructure/redis/redis.service';
import { UpdateTransactionUseCase } from './application/use-cases/update-transaction.use-case';
import { AntifraudConsumer } from './infrastructure/kafka/antifraud.consumer';

@Module({
  imports: [PrismaModule],
  providers: [
    TransactionResolver,
    CreateTransactionUseCase,
    FindTransactionUseCase,
    UpdateTransactionUseCase,
    AntifraudConsumer,
    TransactionRepositoryImpl,
    AntifraudProducer,
    RedisService,
    {
      provide: 'TransactionRepository',
      useExisting: TransactionRepositoryImpl,
    },
  ],})
export class TransactionModule {}