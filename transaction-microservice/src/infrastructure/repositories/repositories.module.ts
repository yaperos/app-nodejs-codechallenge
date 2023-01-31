import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../config/typeorm-config/typeorm.config.module';
import { TransactionStatus } from '../entities/transaction-status.entity';
import { TransactionType } from '../entities/transaction-type.entity';
import { Transaction } from '../entities/transaction.entity';
import { DataBaseTransactionRepository } from './transaction.repository';

@Module({
    imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([Transaction, TransactionType, TransactionStatus])],
    providers: [DataBaseTransactionRepository],
    exports: [DataBaseTransactionRepository]
})
export class RepositoriesModule {}
