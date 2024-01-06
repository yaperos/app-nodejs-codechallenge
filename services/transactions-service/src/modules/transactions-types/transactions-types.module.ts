import { Module } from '@nestjs/common';
import { TransactionsTypesService } from './services/transactions-types.service';
import { TransactionTypeEntity } from './entities/transactions-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [TransactionsTypesService],
  exports: [TransactionsTypesService],
  imports: [TypeOrmModule.forFeature([TransactionTypeEntity])],
})
export class TransactionsTypesModule {}
