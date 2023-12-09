import { Module } from '@nestjs/common';
import { MsTransactionController } from './ms-transaction.controller';
import { MsTransactionService } from './ms-transaction.service';

@Module({
  imports: [],
  controllers: [MsTransactionController],
  providers: [MsTransactionService],
})
export class MsTransactionModule {}
