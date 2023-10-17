import { Controller } from '@nestjs/common';
import { MsTransactionService } from './ms-transaction.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MessageTransactionDto, TRANSACTION_EVENT_ID } from '@app/core-library';

@Controller()
export class MsTransactionController {
  constructor(private readonly msTransactionService: MsTransactionService) {}

  @EventPattern(TRANSACTION_EVENT_ID.UPDATE)
  update(@Payload() messageTransactionDto: MessageTransactionDto) {
    return this.msTransactionService.update(messageTransactionDto);
  }
}
