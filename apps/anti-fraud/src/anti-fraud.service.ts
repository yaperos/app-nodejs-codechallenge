import { TransactionStatus } from '@app/database/enums/transaction-status';
import { TransactionCreatedEvent } from '@app/events/transaction/transaction-created';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AntiFraudService {
  private readonly logger = new Logger(AntiFraudService.name);

  verify(event: TransactionCreatedEvent): TransactionStatus {
    let status = TransactionStatus.APPROVED;

    if (event.value > 1000) {
      status = TransactionStatus.REJECTED;
    }

    this.logger.log(`Transaction status for value ${event.value}: ${status}`);

    return status;
  }
}
