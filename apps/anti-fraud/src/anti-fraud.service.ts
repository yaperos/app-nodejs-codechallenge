import { Injectable, Logger } from '@nestjs/common';
import { TransactionStatus } from './enums/status';

@Injectable()
export class AntiFraudService {
  private readonly logger = new Logger(AntiFraudService.name);

  verify(transactionValue): string {
    const status =
      Number(transactionValue) > 1000
        ? TransactionStatus.REJECTED
        : TransactionStatus.APPROVED;
    this.logger.debug('transaction verified', status);
    return status;
  }
}
