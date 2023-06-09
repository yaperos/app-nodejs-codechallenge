import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialTransactionsModule } from './core/financial-transactions.module';
import { FinancialTransactionEntity } from './shared/infrastructure/financial-transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.DATABASE_URL,
      entities: [FinancialTransactionEntity],
      synchronize: true,
    }),
    FinancialTransactionsModule,
  ],
})
export class AppModule {}
