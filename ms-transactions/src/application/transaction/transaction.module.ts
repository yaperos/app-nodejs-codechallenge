import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { LoggerModule } from '../logger/logger.module';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from 'src/infraestructure/database/models/transactions';

@Module({
  providers: [TransactionService],
  controllers: [TransactionController],
  imports: [LoggerModule, TypeOrmModule.forFeature([Transactions])],
})
export class TransactionModule {}
