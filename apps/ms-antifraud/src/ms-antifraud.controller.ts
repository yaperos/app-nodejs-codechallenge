import { Controller } from '@nestjs/common';
import { MsAntifraudService } from './ms-antifraud.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MsAntifraudController {
  constructor(private readonly msAntifraudService: MsAntifraudService) {}

  @EventPattern('transaction_created_event')
  CreatedTransactionValidate(@Payload() data: any): void {
    console.log(
      'este es un evento transaction_created_event en antifraud: ',
      data,
    );
    this.msAntifraudService.validateValue(data);
  }
}
