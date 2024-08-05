import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dbDataSource } from './data.source';
import { TransactionStatusModel } from './models/status.model';
import { TransactionModel } from './models/transaction.model';
import { TransactionTypeModel } from './models/transaction-type.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dbDataSource),
    TypeOrmModule.forFeature([
      TransactionStatusModel,
      TransactionModel,
      TransactionTypeModel,
    ]),
  ],
  exports: [TypeOrmModule, ConfigModule],
})
export class DatabaseModule {}
