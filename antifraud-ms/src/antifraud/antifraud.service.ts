import { Injectable, Logger } from '@nestjs/common';
import { ValidateTransactionDto } from './dto/validateTransaction.dto';
import { TransactionStatus } from './types';

@Injectable()
export class AntifraudService {
  private readonly logger = new Logger(AntifraudService.name);

  async validateTransaction(transaction: ValidateTransactionDto) {
    const status = transaction.value > 1000 ? TransactionStatus.REJECTED : TransactionStatus.APPROVED;

    this.logger.log(
      `Transaction ${transaction.transactionExternalId} validated -> ${status}`,
    );

    return {
      status,
    };
  }
}
