import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/infrastructure/transaction.module';
import { CoreModule } from './shared/core.module';

@Module({
  imports: [CoreModule, TransactionModule],
})
export class AppModule {}
