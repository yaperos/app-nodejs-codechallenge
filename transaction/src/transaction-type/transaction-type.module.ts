import { Module, forwardRef } from '@nestjs/common';
import { TransactionTypeService } from './transaction-type.service';
import { TransactionTypeResolver } from './transaction-type.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionType]),
    forwardRef(() => TransactionModule),
  ],
  providers: [TransactionTypeResolver, TransactionTypeService],
  exports: [TransactionTypeService],
})
export class TransactionTypeModule {}
