import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { AppDataSource } from './data-source';
import { TransactionType } from 'src/transaction/entities/transaction-type.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        const dataSource = AppDataSource;
        return dataSource.options;
      },
    }),
    TypeOrmModule.forFeature([Transaction, TransactionType]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
