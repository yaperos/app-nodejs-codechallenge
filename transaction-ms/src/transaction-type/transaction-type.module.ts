import { Module } from '@nestjs/common';
import { TransactionTypeResolver } from './transaction-type.resolver';
import { TransactionTypeService } from './transaction-type.service';

@Module({
    providers: [TransactionTypeResolver, TransactionTypeService],
})
export class TransactionTypeModule {}
