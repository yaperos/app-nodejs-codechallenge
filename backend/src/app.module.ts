import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // type: 'sqlite',
      // database: '././yape.sqlite',
      // synchronize: true,
      type: 'postgres', // Cambiado a PostgreSQL
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'Yapedb',
      synchronize: true, 
      entities: [Transaction],
    }),
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionService],
})
export class AppModule {}