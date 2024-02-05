import { Controller, Get } from '@nestjs/common';
import { AntiFraudMsService } from './anti-fraud-ms.service';

@Controller()
export class AntiFraudMsController {
  constructor(private readonly antiFraudMsService: AntiFraudMsService) {}

  @Get()
  getHello(): string {
    return this.antiFraudMsService.getHello();
  }
}
