import { Controller } from '@nestjs/common';
import { AntiFraudService } from '../services/anti-fraud.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { VALIDATE_TRANSACTION } from '@app/common/constants/transaction-events';
import { ValidateTransactionDto } from '@app/common/dtos/requests/validate-transaction.dto';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern(VALIDATE_TRANSACTION)
  validateTransaction(@Payload() data: ValidateTransactionDto) {
    this.antiFraudService.validateTransaction(data);
  }
}
