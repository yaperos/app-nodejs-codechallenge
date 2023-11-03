import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/infrastructure/transaction.module';
import { CoreModule } from './shared/core.module';
import { PostgresProvider } from './shared/infrastructure/database/postgresql/postgresql.provider';

@Module({
  imports: [CoreModule, PostgresProvider, TransactionModule],
})
export class AppModule {}
