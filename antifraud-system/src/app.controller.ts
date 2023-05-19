import { Controller, Post, Body } from '@nestjs/common';
import { AntiFraudService } from './app.service';
import { TransactionFull } from './entities/transaction.entity';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @Post()
  async verifyTransaction(
    @Body() transaction: TransactionFull,
  ): Promise<TransactionFull> {
    return await this.antiFraudService.verifyTransaction(transaction);
  }
}
