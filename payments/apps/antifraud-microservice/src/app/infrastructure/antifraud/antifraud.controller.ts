import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionPresenter } from '@payments/shared/dto';
import { lastValueFrom } from 'rxjs';
import { AntifraudService } from './antifraud.service';

@Controller()
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) {}

  @EventPattern('validate_amount')
  async handleValidateAmount(@Payload()data : TransactionPresenter) {
    const validateAndUpdateTransaction$ = this.antifraudService.validateAndUpdateTransaction(data);
    const transactionPresenter = await lastValueFrom(validateAndUpdateTransaction$);
    return transactionPresenter;
  }
}
