import { Module } from '@nestjs/common';
import databaseConfig from './database.config';
import { TransactionRepository } from '../repositories/transaction.repository';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONFIG',
      useValue: databaseConfig,
    },
    TransactionRepository,
  ],
  exports: [TransactionRepository],
})
export class DatabaseModule {}
