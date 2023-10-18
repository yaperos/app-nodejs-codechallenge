import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MessageBrokerDto } from 'apps/shared/message-broker.dto';
import { AntifraudService } from '../application/antifraud.service';

@Controller()
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) { }

  @MessagePattern('transaction.created')
  handleTransactionCreated(@Payload() message: MessageBrokerDto<number>) {
    this.antifraudService.validateStatus(message);
  }
}
