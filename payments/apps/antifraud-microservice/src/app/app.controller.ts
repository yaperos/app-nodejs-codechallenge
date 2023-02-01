import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionPresenter } from '@payments/shared/dto';
import { lastValueFrom } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('validate_amount')
  async handleValidateAmount(@Payload()data : TransactionPresenter) {
    const validateAndUpdateTransaction$ = this.appService.validateAndUpdateTransaction(data);
    const transactionPresenter = await lastValueFrom(validateAndUpdateTransaction$);
    return transactionPresenter;
  }
}
