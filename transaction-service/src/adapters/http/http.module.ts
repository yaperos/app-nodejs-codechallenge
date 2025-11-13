import { Module } from '@nestjs/common';
import { ApplicationModule } from '@application/application.module';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [TransactionsController],
})
export class HttpModule {}
