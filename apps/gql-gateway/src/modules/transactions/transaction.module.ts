import { Module } from '@nestjs/common';
import { TransactionResolver } from './transaction.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TransactionResolver],
})
export class TransactionModule {}
