import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FraudCheckRequest } from 'src/dtos/requests/fraudcheck.request';
import { AntiFraudService } from 'src/services/antifraud.service';

@Controller()
export class AntiFraudController {
  constructor(
    private readonly antiFraudService: AntiFraudService
    ) {}

  @MessagePattern('antifraud')
  evaluateTransactionFraud(@Payload() request: FraudCheckRequest){
    return this.antiFraudService.evaluateTransactionFraud(request);
  }
}
