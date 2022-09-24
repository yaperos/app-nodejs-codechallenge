import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionsController } from './transaction.controller';
import { TransactionsService } from './transaction.service';
import { Outbox } from './outbox.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Outbox])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
