/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { KafkaService } from 'src/shared/kafka/kafka.service';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly kafkaService: KafkaService) {}

  async validateTransaction(transaction: TransactionDto): Promise<void> {
    const isApproved = this.verifyTransaction(transaction);
    isApproved
      ? await this.validTransactionEmissonEvent(transaction)
      : await this.invalidTransactionEmissonEvent(transaction);
  }

  private verifyTransaction(transaction: TransactionDto): boolean {
    return transaction.value > 1000 ? false : true;
  }

  private async validTransactionEmissonEvent(transaction): Promise<void> {
    await this.kafkaService.sendMessage('transaction-approved', {
      id: transaction.id,
    });
  }

  private async invalidTransactionEmissonEvent(transaction): Promise<void> {
    await this.kafkaService.sendMessage('transaction-rejected', {
      id: transaction.id,
    });
  }
}
