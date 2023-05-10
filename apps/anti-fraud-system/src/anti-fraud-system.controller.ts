import { Controller, Get } from '@nestjs/common';
import { AntiFraudSystemService } from './anti-fraud-system.service';

@Controller()
export class AntiFraudSystemController {
  constructor(
    private readonly antiFraudSystemService: AntiFraudSystemService,
  ) {}

  @Get()
  getHello(): string {
    return this.antiFraudSystemService.getHello();
  }
}
