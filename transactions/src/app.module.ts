import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Transactions } from './transactions/transactions.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: '1234',
      database: 'transactions',
      entities: [Transactions],
      synchronize: true, //false for production
    }),
    TransactionsModule,
  ],
})
export class AppModule {}
