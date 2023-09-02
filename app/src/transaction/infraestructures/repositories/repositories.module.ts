import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionRepository } from './transaction.repository';

@Module({
  imports: [/*TypeOrmConfigModule,*/ TypeOrmModule.forFeature([TransactionEntity])],
  providers: [TransactionRepository],
  exports: [TransactionRepository],
})
export class RepositoriesModule {}