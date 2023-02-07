import { Controller, Body } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AntiFraudController {
  @MessagePattern('verify')
  verifyTransaction(@Body() value: number): Observable<number> {
    let resVerify = 1;
    if (value > 1000) {
      resVerify = 2;
    }
    return of(resVerify);
  }
}
