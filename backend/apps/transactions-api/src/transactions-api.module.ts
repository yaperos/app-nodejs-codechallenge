import { Module } from '@nestjs/common';

import { TransactionsApiController } from './transactions-api.controller';
import { TransactionsApiService } from './transactions-api.service';

@Module({
  imports: [],
  controllers: [TransactionsApiController],
  providers: [TransactionsApiService],
})
export class TransactionsApiModule {}
