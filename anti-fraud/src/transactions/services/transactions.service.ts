import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

import { Transaction } from '../contracts/types';
import { KafkaService } from '../../kafka/services/kafka.service';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);
  private maxTransactionValue: number;
  private approveTransactionEvent: string;
  private rejectTransactionEvent: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaService: KafkaService,
  ) {}

  onModuleInit(): void {
    this.maxTransactionValue = +this.configService.get('MAX_TRANSACTION_VALUE');
    this.approveTransactionEvent = this.configService.get(
      'APPROVE_TRANSACTION_EVENT',
    );
    this.rejectTransactionEvent = this.configService.get(
      'REJECT_TRANSACTION_EVENT',
    );
  }

  sendValidationStatusEvent(trxData: Transaction): void {
    if (trxData.value > this.maxTransactionValue) {
      this.logger.log(
        `Emiting transaction rejection event for transaction ID ${trxData.id}`,
      );
      this.kafkaService.emitEvent(this.rejectTransactionEvent, {
        id: trxData.id,
      });
      return;
    }
    this.logger.log(
      `Emiting transaction approval event for transaction ID ${trxData.id}`,
    );
    this.kafkaService.emitEvent(this.approveTransactionEvent, {
      id: trxData.id,
    });
  }
}
