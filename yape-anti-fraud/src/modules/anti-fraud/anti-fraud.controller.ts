import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';
import { AntifraudPattern } from '@core/config/constant';
import { ValidateTransactionDto } from '@core/config/types';

@Controller()
export class AntiFraudController {
  private readonly logger = new Logger(AntiFraudController.name);
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern(AntifraudPattern.VALIDATE_ANTIFRAUD)
  validateTransaction(@Payload() validateTransactionDto: ValidateTransactionDto) {
    this.logger.log(`MESSAGE PATTERN  : ${AntifraudPattern.VALIDATE_ANTIFRAUD}`);
    return this.antiFraudService.validateTransaction(validateTransactionDto);
  }
}
