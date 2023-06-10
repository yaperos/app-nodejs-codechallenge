import { Module } from '@nestjs/common';
import { CreateTransactionService } from '../../../application/create-transaction.service';
import { TransactionController } from '../../transaction.controller';
import { TransactionTable } from '../../orm/tables/transaction.table';
import { FindTransactionService } from '../../../application/find-transaction.service';
import { TransactionRepository } from '../../orm/repository/transaction.repository';
import { TransactionRepositoryInterface } from '../../../domain/repository/transaction.repository.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateTransactionService } from '../../../application/update-transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionTable])],
  controllers: [TransactionController],
  providers: [
    CreateTransactionService,
    UpdateTransactionService,
    FindTransactionService,
    {
      provide: TransactionRepositoryInterface,
      useClass: TransactionRepository,
    },
  ],
})
export class TransactionModule {}
