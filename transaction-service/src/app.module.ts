import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [TransactionModule, DatabaseModule],
})
export class AppModule {}
