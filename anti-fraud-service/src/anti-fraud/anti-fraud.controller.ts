import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { HandleTransactionDto } from './dto/handle-transaction.dto';
import { AntiFraudService } from './anti-fraud.service';

@Controller('anti-fraud')
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern('transaction_created')
  handleTransaction(@Payload() transaction: HandleTransactionDto) {
    return this.antiFraudService.handleTransaction(transaction);
  }
}
