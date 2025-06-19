import { EvaluateTransactionDto } from './dto/evaluate-transaction.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';

@Controller('anti-fraud')
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) { }

  @Post('evaluate')
  evaluate(@Body() dto: EvaluateTransactionDto) {
    return this.antiFraudService.evaluate(dto);
  }
}
