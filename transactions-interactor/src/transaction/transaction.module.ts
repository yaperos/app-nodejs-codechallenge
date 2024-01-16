import { Module, forwardRef } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { KafkaService } from 'src/shared/kafka/kafka.service';
import { Account } from 'src/entities/account.entity';

@Module({
  providers: [TransactionService, KafkaService],
  exports: [TransactionService],
  controllers: [TransactionController],
  imports: [forwardRef(() => TypeOrmModule.forFeature([Transaction, Account]))],
})
export class TransactionModule {}
