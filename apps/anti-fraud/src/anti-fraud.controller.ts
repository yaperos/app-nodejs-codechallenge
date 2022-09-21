import { Controller, Get } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @Get()
  getHello(): string {
    return this.antiFraudService.getHello();
  }
}
