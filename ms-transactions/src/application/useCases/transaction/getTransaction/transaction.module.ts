import { Module } from '@nestjs/common';
import { GetTransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from '../../../../infraestructure/database/models/transactions';

@Module({
  providers: [GetTransactionResolver, TransactionService],
  controllers: [],
  imports: [TypeOrmModule.forFeature([Transactions])],
})
export class GetTransactionModule {}
