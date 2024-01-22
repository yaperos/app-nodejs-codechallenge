import { TransactionStatus } from '@app/database/enums/transaction-status';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AntiFraudService {
  private readonly logger = new Logger(AntiFraudService.name);

  verify(value: string): TransactionStatus {
    let status = TransactionStatus.APPROVED;

    if (Number(value) > 1000) {
      status = TransactionStatus.REJECTED;
    }

    this.logger.log(`Transaction status for value ${value}: ${status}`);

    return status;
  }
}
