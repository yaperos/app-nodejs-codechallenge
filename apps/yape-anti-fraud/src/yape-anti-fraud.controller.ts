import { Controller, Get } from '@nestjs/common';
import { YapeAntiFraudService } from './yape-anti-fraud.service';
import {EventPattern, Payload} from "@nestjs/microservices";

@Controller()
export class YapeAntiFraudController {
  constructor(private readonly yapeAntiFraudService: YapeAntiFraudService) {}

  @EventPattern('yape.af.validate')
  handleLogin(@Payload() data: any) {
    console.log('af event received');
    console.log(data);
    this.yapeAntiFraudService.validate(data);
  }
}
