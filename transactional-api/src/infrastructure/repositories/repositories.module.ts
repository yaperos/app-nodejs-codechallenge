import { Module } from '@nestjs/common';
import { TransactionRepository } from './transaction/transaction.repository';

@Module({
    providers: [ TransactionRepository ]
})
export class RepositoriesModule {}
