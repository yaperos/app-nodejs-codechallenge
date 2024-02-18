import { Controller, Body } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AntiFraudController {
  @MessagePattern('validate')
  validateTransaction(@Body() transactionAmount: number): Observable<number> {
    let validationResult = transactionAmount > 1000 ? 2 : 1;

    return of(validationResult);
  }
}
