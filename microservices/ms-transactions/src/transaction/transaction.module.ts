import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionEntity } from 'src/models/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaService } from 'src/services/kafka.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  controllers: [TransactionController],
  providers: [TransactionService, KafkaService],
  exports: [TransactionService],
})
export class TransactionModule {}
