import { Module } from '@nestjs/common';
import { FindByIdTransactionUseCase } from 'src/application/use-cases/find-by-id-transaction.use-case';
import { SaveTransactionUseCase } from 'src/application/use-cases/save-transaction.use-case';
import { DatabaseModule } from '../database/database.module';
import { ProducerModule } from '../messaging/producer/producer.module';
import { TransactionController } from './controllers/transaction.controller';
import { ExceptionsModule } from '../services/exceptions/exceptions.module';
import { LoggerModule } from '../services/logger/logger.module';

@Module({
  imports: [DatabaseModule, ProducerModule, ExceptionsModule, LoggerModule],
  providers: [SaveTransactionUseCase, FindByIdTransactionUseCase],
  controllers: [TransactionController],
})
export class HttpModule {}
