import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxEventEntity } from '../payments/entities/outbox-event.entity';
import { OutboxRelayService } from './outbox-relay.service';

@Module({
  imports: [TypeOrmModule.forFeature([OutboxEventEntity])],
  providers: [OutboxRelayService],
  exports: [OutboxRelayService],
})
export class RelayModule {}
