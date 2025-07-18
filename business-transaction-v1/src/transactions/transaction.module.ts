import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionCreatorService } from './services/transaction-creator.service';
import { TransactionReaderService } from './services/transaction-reader.service';
import { TransactionUpdaterService } from './services/transaction-updater.service';
import { TransactionDeleterService } from './services/transaction-deleter.service';
import { ApplicationPropertiesService } from '../config/application-properties.service';
import { KafkaModule } from '../kafka/kafka.module';
import { kafkaConfig } from '../config/kafka.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ConfigModule.forFeature(kafkaConfig), // Add kafka configuration
    forwardRef(() => KafkaModule), // Use forwardRef to avoid circular dependency
  ],
  providers: [
    ApplicationPropertiesService,
    TransactionService,
    TransactionCreatorService,
    TransactionReaderService,
    TransactionUpdaterService,
    TransactionDeleterService,
  ],
  controllers: [TransactionController],
  exports: [
    TransactionService,
    TransactionCreatorService,
    TransactionReaderService,
    TransactionUpdaterService,
    TransactionDeleterService,
  ],
})
export class TransactionsModule {}
