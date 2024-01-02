import { Controller, ValidationPipe } from '@nestjs/common';

import { AntiFraudService } from '../application/anti-fraud.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MICROSERVICES_CONSTANTS, TransactionDto } from '@yape-transactions/shared';
import { AntiFraudCommand } from '../domain/anti-fraud.command';

@Controller()
export class AntiFraudController {
  constructor(private readonly appService: AntiFraudService) { }

  @EventPattern(MICROSERVICES_CONSTANTS.EVENTS.TRANSACTION_CREATED)
  handleTransactionCreated(@Payload(ValidationPipe) data: TransactionDto) {
    const antiFraudCommand = new AntiFraudCommand(data);
    this.appService.processCreatedTrasaction(antiFraudCommand);
  }
}
