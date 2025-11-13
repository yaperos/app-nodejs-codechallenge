import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from '@application/application.module';
import { KafkaFactory } from './kafka.factory';
import { SchemaRegistryService } from './schema-registry.service';
import { StatusEventPublisher } from './status-event.publisher';
import { TransactionsCreatedConsumer } from './transactions-created.consumer';
import { STATUS_EVENT_PUBLISHER } from '@ports/tokens';

@Module({
  imports: [ConfigModule, forwardRef(() => ApplicationModule)],
  providers: [
    KafkaFactory,
    SchemaRegistryService,
    StatusEventPublisher,
    TransactionsCreatedConsumer,
    {
      provide: STATUS_EVENT_PUBLISHER,
      useExisting: StatusEventPublisher,
    },
  ],
  exports: [TransactionsCreatedConsumer, STATUS_EVENT_PUBLISHER],
})
export class MessagingModule {}
