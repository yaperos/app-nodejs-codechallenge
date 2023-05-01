import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionValidationService } from './transaction-validation.service';
import { ValidateAntiFraudDto } from './dto/validate-anti-fraud.dto';

@Controller()
export class TransactionValidationController {
  constructor(
    private readonly transactionValidationService: TransactionValidationService,
  ) {}

  @MessagePattern('transactionValidation')
  create(@Payload() validateAntiFraudDto: ValidateAntiFraudDto) {
    return this.transactionValidationService.validateTransaction(
      validateAntiFraudDto,
    );
  }
}
