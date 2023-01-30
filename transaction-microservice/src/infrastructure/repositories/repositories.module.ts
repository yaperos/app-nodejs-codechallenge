import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../config/typeorm-config/typeorm.config.module';
import { Transaction } from '../entities/transaction.entity';
import { DataBaseTransactionRepository } from './transaction.repository';

@Module({
    imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([Transaction])],
    providers: [DataBaseTransactionRepository],
    exports: [DataBaseTransactionRepository]
})
export class RepositoriesModule {}
