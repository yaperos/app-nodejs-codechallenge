import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dbDataSource } from './data.source';
import { TransactionStatus } from './entities/status.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dbDataSource),
    TypeOrmModule.forFeature([TransactionStatus, Transaction]),
  ],
  exports: [TypeOrmModule, ConfigModule],
})
export class DatabaseModule {}
