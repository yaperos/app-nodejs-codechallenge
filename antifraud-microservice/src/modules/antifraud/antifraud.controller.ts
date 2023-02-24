import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AntifraudService } from './antifraud.service';
import { ValidateTransactionDto, AntifraudPattern } from './antifraud.types';

@Controller()
export class AntifraudController {
  constructor(private readonly transactionService: AntifraudService) {}

  @EventPattern(AntifraudPattern.VALIDATE_ANTIFRAUD)
  validateTransaction(data: ValidateTransactionDto) {
    return this.transactionService.validateTransaction(data);
  }
}
