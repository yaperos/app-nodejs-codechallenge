import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionDto } from './dtos/transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('transaction-validate')
  handleTransactionValidate(@Payload() data: TransactionDto) {
    this.appService.validateTransactionAntiFraud(data);
  }
}
