import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionType } from 'src/domain/entities/transaction-type.entity';
import { TransactionTypeService } from './services/transaction-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionType])],
  providers: [TransactionTypeService],
  exports: [TransactionTypeService],
})
export class TransactionTypeModule {}
