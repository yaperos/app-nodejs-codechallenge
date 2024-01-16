import { Injectable } from '@nestjs/common';
import { KafkaService } from 'src/shared/kafka/kafka.service';

@Injectable()
export class TransactionService {
  constructor(private readonly kafkaService: KafkaService) {}

  async createTransaction(transaction): Promise<string> {
    await this.kafkaService.sendMessage('transaction-created', transaction);
    return 'Transaction created successfully';
  }
}
