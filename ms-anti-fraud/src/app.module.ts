import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './transactions/transactions.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TransactionsModule,
  ]
})
export class AppModule {}
