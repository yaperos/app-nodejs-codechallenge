import { Module } from '@nestjs/common';
import { TransactionsApiController } from './transactions.controller';
import { ApplicationModule } from '../../../application/application.module';

@Module({
  imports: [
    ApplicationModule
  ],
  controllers: [TransactionsApiController],
})
export class TransactionApiModule {}