import { Module } from '@nestjs/common';
import TransactionModule from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import TransactionsEntity from './transactions/transactions.entity';

@Module({
  imports: [
    TransactionModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:"localhost",
      port:5432,
      username:"postgres",
      password:"postgres",
      database:"postgres",
      entities:[TransactionsEntity],
      synchronize: true

    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
