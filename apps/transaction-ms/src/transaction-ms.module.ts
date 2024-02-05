import { Module } from '@nestjs/common';
import { TransactionMsController } from './transaction-ms.controller';
import { TransactionMsService } from './transaction-ms.service';

@Module({
  imports: [],
  controllers: [TransactionMsController],
  providers: [TransactionMsService],
})
export class TransactionMsModule {}
