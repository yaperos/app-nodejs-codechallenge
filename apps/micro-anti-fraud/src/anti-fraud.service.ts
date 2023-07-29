import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka/kafka.service';
import { TransactionMessage } from './entities/transaction.message';
import { TransactionStatus } from './constants/transactionstatus.enum';

@Injectable()
export class MicroAntiFraudService {
  constructor(
    private readonly kafkaService: KafkaService
  ) { }

  async validateTransactionAmount(payload: TransactionMessage): Promise<void> {
    const { transactionExternalId, amount } = payload;

    await this.kafkaService.sendTransactionStatus({
      transactionExternalId: transactionExternalId,
      transactionStatusId: amount > 1000 ? TransactionStatus.REJECTED : TransactionStatus.APPROVED,
    });
  }
}
