import { Module } from '@nestjs/common';
import { GetTransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from '../../../../infraestructure/database/models/transactions';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  providers: [GetTransactionResolver, TransactionService],
  controllers: [],
  imports: [TypeOrmModule.forFeature([Transactions]), LoggerModule],
})
export class GetTransactionModule {}
