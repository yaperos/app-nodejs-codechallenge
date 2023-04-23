import { Controller, Get } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService
    ) {}

  @EventPattern('anti-fraud')
  handleTransactionCheck(data: any) {
    this.antiFraudService.handleTransactionCheck(data);
  }

}
