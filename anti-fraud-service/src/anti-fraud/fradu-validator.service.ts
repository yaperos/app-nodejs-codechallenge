import { Injectable, Logger } from '@nestjs/common';
import { TransactionStatus } from './transaction-status';
import { sleep } from 'src/utils/sleep';

@Injectable()
export class FraudValidatorService {
  private readonly logger = new Logger(FraudValidatorService.name);

  async validateFraud(): Promise<TransactionStatus> {
    await sleep(1000);
    const randomNumber = Math.random();

    // If the number is less than 0.5, return "approved", otherwise return "rejected"
    return randomNumber < 0.4
      ? TransactionStatus.APPROVED
      : TransactionStatus.REJECTED;
  }
}
