import { Controller } from '@nestjs/common';
import { MsAntiFraudService } from './ms-anti-fraud.service';
import { MessageTransactionDto, TRANSACTION_EVENT_ID } from '@app/core-library';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MsAntiFraudController {
  constructor(private readonly msAntiFraudService: MsAntiFraudService) {}

  @MessagePattern(TRANSACTION_EVENT_ID.CREATED)
  validateAmount(@Payload() messageTransactionDto: MessageTransactionDto): any {
    return this.msAntiFraudService.validateAmount(messageTransactionDto);
  }
}
