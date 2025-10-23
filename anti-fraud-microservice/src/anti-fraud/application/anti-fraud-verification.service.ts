import { Injectable } from '@nestjs/common';
import { VerifyTransactionValueCommand } from 'src/anti-fraud/application/verify-transaction-value-command';
import { Transaction } from 'src/anti-fraud/domain/Transaction';
import { StreamingService } from 'src/streaming/streaming.service';

@Injectable()
export class AntiFraudVerificiationService {
  constructor(private readonly streamingService: StreamingService) {}
  verifyAmount(command: VerifyTransactionValueCommand): void {
    const transaction = new Transaction(
      command.id,
      command.transactionStatus,
      command.value,
    );
    transaction.verifyFraud();
    const transactionPrimitives = transaction.toPrimitives();

    this.streamingService.publishEvent(
      'transaction.verified',
      transactionPrimitives,
      transactionPrimitives.uuid,
    );
  }
}
