import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { KafkaConsumerService } from 'src/infrastructure/services/kafka/consumer/kafka-consumer.service';
import { LoggerModule } from 'src/infrastructure/services/logger/logger.module';
import { UpdateStatusTransactionUseCase } from '../../../application/use-cases/update-status-trasanction.use-case';
import { TransactionConsumer } from './transaction.consumer';

@Module({
  imports: [DatabaseModule, LoggerModule],
  providers: [KafkaConsumerService, UpdateStatusTransactionUseCase],
  controllers: [TransactionConsumer],
})
export class ConsumerModule {}
