import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AntifraudService } from './antifraud.service';
import { MessageBrokerDto } from './dto/message-broker.dto';

@Controller()
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) { }

  /* @EventPattern('transaction.created')
  handleTransactionCreated(@Payload() message: MessageBrokerDto<any>) {
    this.antifraudService.validateStatus(message.content);
  } */

  @EventPattern('transaction.created')
  handleTransactionCreated(data: any) {
    console.log('data:', data);
  }
}