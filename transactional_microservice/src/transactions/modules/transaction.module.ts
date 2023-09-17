import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelInterface } from 'src/../start/interfaces/model.interface';
// Entities
import { Transaction, TransactionSchema } from '../entities/transaction.entity';
const models: ModelInterface[] = [
  {
    name: Transaction.name,
    schema: TransactionSchema,
    collection: 'transactions',
  },
];
// Services
import { TransactionService } from '../services/transaction.service';

@Module({
  imports: [MongooseModule.forFeature(models)],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
