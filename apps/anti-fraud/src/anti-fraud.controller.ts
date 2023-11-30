import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AntifraudService } from './anti-fraud.service';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntifraudService) {}

  @EventPattern('transaction_created')
  receiveTransaction(data: any) {
    console.log({ data });
    return this.antiFraudService.validateTransaction(data);
  }
}
