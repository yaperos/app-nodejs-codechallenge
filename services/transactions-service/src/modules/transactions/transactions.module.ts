import { Module } from '@nestjs/common';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionEntity } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { TransactionsTypesModule } from '../transactions-types/transactions-types.module';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [
    TransactionsTypesModule,
    CommonModule,
    TypeOrmModule.forFeature([TransactionEntity]),
  ],
})
export class TransactionsModule {}
