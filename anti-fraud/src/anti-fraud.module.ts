import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppService } from './app.service';
import { TransactionOpenedHandler } from './application/event/transaction-opened.handler';
import { InjectionToken } from './application/injection.token';
import { ValidateTransactionHandler } from './application/validate-transaction/validate-transaction.handler';
import { TransactionFactory } from './domain/factory';
import { TransactionConsumer } from './infrastructure/consumers/transaction.consumer';
import { IntegrationEventPublisherImplement } from './infrastructure/producers/transaction-event.producer';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.INTEGRATION_EVENT_PUBLISHER,
    useClass: IntegrationEventPublisherImplement,
  },
];
const application = [TransactionOpenedHandler, ValidateTransactionHandler];
const domain = [TransactionFactory];
@Module({
  imports: [CqrsModule],
  controllers: [TransactionConsumer],
  providers: [AppService, ...infrastructure, ...application, ...domain],
})
export class AntiFraudModule {}
