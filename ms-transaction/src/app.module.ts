import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TransferType } from './modules/transactions/entities/transaction-type.entity';
import { Transaction } from './modules/transactions/entities/transaction.entity';
import { TransactionsModule } from './modules/transactions/transactions.module';

import { AppController } from './app.controller';
import { ConfigEnv } from './config';

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: ConfigEnv.db.host,
      port: ConfigEnv.db.port as number,
      username: ConfigEnv.db.username,
      password: ConfigEnv.db.password,
      database: ConfigEnv.db.database,
      synchronize: true,
      entities: [Transaction, TransferType],
    }),
    TransactionsModule,
  ],
  exports: [TypeOrmModule],
})
export class AppModule {}
