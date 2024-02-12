import { Controller, Get } from '@nestjs/common';
import { AntiFraudService } from '../../domain/services/anti-fraud.service';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @Get()
  getHello(): Promise<void> {
    return this.antiFraudService.checkTransaction();
  }
}
