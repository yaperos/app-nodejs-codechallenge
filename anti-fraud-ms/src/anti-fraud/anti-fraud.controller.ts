import { Controller } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { EventPattern } from '@nestjs/microservices';
import { VerifyTransactionDto } from './dto/verify-transaction.dto';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern('verify.transaction')
  async verifyTransaction(verifyTransactionDto: VerifyTransactionDto) {
    return await this.antiFraudService.verifyTransaction(verifyTransactionDto);
  }
}
