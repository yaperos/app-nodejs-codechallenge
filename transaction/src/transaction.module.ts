import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTransactionHandler } from './application/create-transaction/create-transaction.handler';
import { InjectionToken } from './application/injection.token';
import { TransactionRepositoryImplement } from './infrastructure/repository/transaction.repository';
import { TransactionOpenedHandler } from './application/event/transaction-opened.handler';
import { TransactionQueryImplement } from './infrastructure/query/transaction.query';
import { FindTransactionByIdHandler } from './application/get-transaction/find-transaction-by-id.handler';
import { AppService } from './app.service';
import { CreateTransactionController } from './api/controller/create.transaction.controller';
import { GetTransactionController } from './api/controller/get.transaction.controller';
import { TransactionConsumer } from './infrastructure/consumers/transaction.consumer';
import { UpdateStatusTransactionHandler } from './application/update-status-transaction/update-status-transaction.handler';
import { IntegrationEventPublisherImplement } from './infrastructure/producers/integration-event.publisher';
import { TransactionFactory } from './domain/factory';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.TRANSACTION_REPOSITORY,
    useClass: TransactionRepositoryImplement,
  },
  {
    provide: InjectionToken.INTEGRATION_EVENT_PUBLISHER,
    useClass: IntegrationEventPublisherImplement,
  },
  {
    provide: InjectionToken.TRANSACTION_QUERY,
    useClass: TransactionQueryImplement,
  },
];

const application = [
  TransactionOpenedHandler,
  CreateTransactionHandler,
  FindTransactionByIdHandler,
  UpdateStatusTransactionHandler,
];
const domain = [TransactionFactory];
@Module({
  imports: [CqrsModule],
  controllers: [CreateTransactionController, GetTransactionController, TransactionConsumer],
  providers: [AppService, ...infrastructure, ...application, ...domain],
})
export class TransactionModule {}
