import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionStatusModule } from './transaction-status/transaction-status.module';
import { DatabaseModule } from './database/database.module';
import { TransactionTypeModule } from './transaction-type/transaction-type/transaction-type.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TransactionStatusModule,
    TransactionModule,
    TransactionTypeModule
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule]
})
export class AppModule {}
