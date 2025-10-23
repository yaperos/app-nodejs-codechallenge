import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionModel, TransactionSchema } from 'src/transactions/infrastructure/out/transaction.model';
import { TransactionsResolver } from 'src/transactions/infrastructure/in/transactions.resolver';
import { TransactionsManagerService } from 'src/transactions/application/transactions-manager.service';
import { TransactionsPersistenceService } from 'src/transactions/infrastructure/out/transactions-persistence.service';
import { StreamingService } from 'src/streaming/streaming.service';
import { StreamingModule } from 'src/streaming/streaming.module';
import { EventsController } from 'src/transactions/infrastructure/in/events.controller';
import { CreateTransactionUseCase } from 'src/transactions/application/create-transaction-use-case';

@Module({
  imports: [MongooseModule.forFeature([{ name: TransactionModel.name, schema: TransactionSchema }]), StreamingModule],
  providers: [
    StreamingService,
    CreateTransactionUseCase,
    TransactionsPersistenceService,
    TransactionsManagerService,
    TransactionsResolver,
  ],
  controllers: [EventsController],
})
export class TransactionsModule {}
