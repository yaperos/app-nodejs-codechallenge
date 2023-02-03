import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ShowTransactionDto } from '../domain/dto/show-transaction.dto';
import { AntiFraudService } from '../domain/anti-fraud.service';

@Controller()
export class AppController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern('validate-transaction')
  validateTransaction(transaction: ShowTransactionDto) {
    console.log(`Received event: ${transaction}`);
    console.log(transaction);
    this.antiFraudService.validate(transaction);
  }
}
