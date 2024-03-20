import { Module } from '@nestjs/common';
import { VerifyTransactionUseCase } from '../../../application/use-cases/verify-transaction.user-case';
import { ProducerModule } from '../producer/producer.module';
import { TransactionConsumer } from './transaction.consumer';
import { LoggerModule } from '../../services/logger/logger.module';

@Module({
  imports: [ProducerModule, LoggerModule],
  providers: [VerifyTransactionUseCase],
  controllers: [TransactionConsumer],
})
export class ConsumerModule {}
