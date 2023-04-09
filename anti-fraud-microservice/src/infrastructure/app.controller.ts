import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from '../application/app.service';
import { TransactionStatusEnum } from '../domain/enums/transaction-status.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('validate_transaction')
  handleValidateTransaction(
    @Payload('value') value: number,
  ): TransactionStatusEnum {
    return this.appService.validateTransaction(value);
  }
}
