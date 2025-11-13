import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from '@application/application.module';
import { KafkaFactory } from './kafka.factory';
import { SchemaRegistryService } from './schema-registry.service';
import { KafkaEventPublisher } from './kafka-event.publisher';
import { StatusChangedConsumer } from './status.consumer';
import { KafkaSetupService } from './setup.service';
import { EVENT_PUBLISHER } from '@ports/tokens';

@Module({
  imports: [ConfigModule, ApplicationModule],
  providers: [
    KafkaFactory,
    SchemaRegistryService,
    KafkaEventPublisher,
    StatusChangedConsumer,
    KafkaSetupService,
    {
      provide: EVENT_PUBLISHER,
      useExisting: KafkaEventPublisher,
    },
  ],
  exports: [KafkaEventPublisher, StatusChangedConsumer, KafkaSetupService, EVENT_PUBLISHER],
})
export class MessagingModule {}
