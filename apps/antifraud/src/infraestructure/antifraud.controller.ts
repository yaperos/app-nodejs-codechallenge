import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MessageBrokerDto } from 'apps/shared/message-broker.dto';
import { AntifraudService } from '../application/antifraud.service';

@Controller()
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) { }

  @EventPattern('transaction.created')
  handleTransactionCreated(@Payload() message: MessageBrokerDto<any>) {
    this.antifraudService.validateStatus(message.content);
  }
}
