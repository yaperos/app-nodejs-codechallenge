import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { Transaction } from '../transaction/transaction.entity';
import { TransactionStatus } from '../shared/enums/transaction-status.enum';

@Injectable()
export class AntiFraudService {
  constructor(private readonly kafkaService: KafkaService) {}

  async validateTransaction(transaction: Transaction): Promise<TransactionStatus> {

    if (transaction.value > 1000) {
      await this.kafkaService.sendMessage('transaction_status_rejected', transaction);
      return TransactionStatus.REJECTED;
    } else {
      await this.kafkaService.sendMessage('transaction_status_approved', transaction);
      return TransactionStatus.APPROVED;
    }
  }
}
