import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxRelayService } from './outbox.service';

@Injectable()
export class OutboxCronService {

  constructor(private outboxRelayService: OutboxRelayService) {}

  @Cron(CronExpression.EVERY_SECOND)
  handleCron() {
    this.outboxRelayService.relayMessages();
  }
}
