import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudService } from '../services/anti-fraud.service';
import { PayloadData } from '../interfaces';

@Controller()
export class AntiFraudController {
  constructor(private validationSvc: AntiFraudService) {}
  @MessagePattern('create-transaction')
  newTransactionToValidate(@Payload() payload: PayloadData) {
    return this.validationSvc.validateTransaction(payload.transactionCreated);
  }
}
