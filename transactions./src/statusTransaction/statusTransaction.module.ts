
import { Module } from '@nestjs/common';
import { StatusTransactionController } from './statusTransaction.controller';
import { StatusTransactionService } from './statusTransaction.service';

@Module({
  controllers: [StatusTransactionController],
  providers: [StatusTransactionService],
})
export class StatusTransactionModule {}
