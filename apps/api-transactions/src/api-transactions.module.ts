import { Module } from '@nestjs/common';
import { ApiTransactionsController } from './api-transactions.controller';
import { ApiTransactionsService } from './api-transactions.service';

@Module({
  imports: [],
  controllers: [ApiTransactionsController],
  providers: [ApiTransactionsService],
})
export class ApiTransactionsModule {}
