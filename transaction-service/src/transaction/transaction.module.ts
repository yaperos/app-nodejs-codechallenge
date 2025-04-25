import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction-repository';
import { DatabaseModule } from 'src/database/database.module';
import { KafkaModule } from 'src/kafka.module';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  imports: [DatabaseModule, KafkaModule],
})
export class TransactionModule {}
