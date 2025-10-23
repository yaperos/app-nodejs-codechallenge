import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTransactionHandler } from './transactions/commands/handlers/create-transaction.handler'
import { RetrieveTransactionHandler } from './transactions/queries/handlers/retrieve-transaction.handler';
import { TransactionCreatedHandler } from './transactions/events/handlers/transaction-created.handler';
import { UpdateTransactionStatusHandler } from './transactions/commands/handlers/update-transaction.handler';

const CommandHandlers = [CreateTransactionHandler, UpdateTransactionStatusHandler];
const QueryHandlers = [RetrieveTransactionHandler];
const EventsHandlers = [TransactionCreatedHandler]

@Module({
  imports: [CqrsModule],
  providers: [...CommandHandlers, ...QueryHandlers, ...EventsHandlers],
  exports: [CqrsModule]
})
export class ApplicationModule {}