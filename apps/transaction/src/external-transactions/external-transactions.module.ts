import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExternalTransaction,
  ExternalTransactionSchema,
} from './external-transaction.entity';
import { ExternalTransactionsController } from './external-transactions.controller';
import { ExternalTransactionsSubscriber } from './external-transactions.subscriber';
import { ExternalTransactionsService } from './external-transactions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExternalTransaction.name, schema: ExternalTransactionSchema },
    ]),
  ],
  controllers: [ExternalTransactionsController],
  providers: [ExternalTransactionsService, ExternalTransactionsSubscriber],
})
export class ExternalTransactionsModule {}
