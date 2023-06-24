import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Transaction } from '../contracts/types';
import { KafkaService } from '../../kafka/services/kafka.service';

@Injectable()
export class TransactionsService {
  private maxTransactionValue: number;
  private antiFraudTopic: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaService: KafkaService,
  ) {}

  onModuleInit(): void {
    this.maxTransactionValue = +this.configService.get('MAX_TRANSACTION_VALUE');
    this.antiFraudTopic = this.configService.get('ANTI_FRAUD_TOPIC');
  }

  sendValidationStatusMessage(message: Transaction) {
    let approved = true;

    if (message.value > this.maxTransactionValue) {
      approved = false;
    }

    this.kafkaService.sendMessage(this.antiFraudTopic, {
      id: message.id,
      approved,
    });
  }
}
