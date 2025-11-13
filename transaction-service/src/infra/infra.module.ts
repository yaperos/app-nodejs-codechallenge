import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessagingModule } from '@adapters/messaging/messaging.module';
import { PersistenceModule } from '@adapters/persistence/persistence.module';
import { OutboxPublisher } from './outbox/outbox.publisher';

@Module({
  imports: [ConfigModule, MessagingModule, PersistenceModule],
  providers: [OutboxPublisher],
  exports: [OutboxPublisher],
})
export class InfraModule {}
