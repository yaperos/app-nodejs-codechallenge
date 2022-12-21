import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { TransactionService } from 'src/adapter/output/db/transaction.service';
import { Transaction } from '../models/transaction.interface';
import { AntifraudAnalysisResponsePayload } from '../models/events/antifraud_analysis_response.payload';
import { MessagingService } from 'src/adapter/input_output/messaging/messaging.service';
import { TransactionStatus } from '../models/transaction_status.enum';
import { AntifraudCheckPayload } from '../models/events/antifraud_check.payload';

@Injectable()
export class FraudAnalysisUsecase implements OnModuleInit {
  private analysisResponseTopic: string;

  onModuleInit() {
    // Consumer for topic "antifraud-check"
    const antifraudCheckTopic = this.configService.get(
      'application.transport.event-driven.kafka.topics.antifraud-check',
    );

    this.messagingService.addTopicConsumer(antifraudCheckTopic, (msg) => {
      const checkPayload: AntifraudCheckPayload = JSON.parse(
        msg.value.toString(),
      );

      Logger.log(
        `>> ANTIFRAUD FraudAnalysisUsecase: read incoming message ` +
          `${JSON.stringify(checkPayload)}`,
      );

      const transactionId: string = checkPayload.transactionId;
      this.analyze(transactionId);
    });

    this.messagingService.subscribeConsumers();
  }

  constructor(
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
    private readonly messagingService: MessagingService,
  ) {}

  analyze(transactionId: string) {
    Logger.log(
      'FraudAnalysisUsecase analyze() transactionId: ' + transactionId,
    );

    this.transactionService.findById(transactionId).subscribe((tx) => {
      if (!tx) {
        throw new NotFoundException('Transaction not found: ' + transactionId);
      }
      Logger.log(
        'FraudAnalysisUsecase analyze:: record: ' + JSON.stringify(tx),
      );

      const newStatus = this.getStatus(tx);

      const payload: AntifraudAnalysisResponsePayload = {
        transactionId: tx.transactionExternalId,
        version: tx.version,
        newStatus,
      };

      Logger.log(
        'FraudAnalysisUsecase: send antifraud analysis to Transaction: ' +
          JSON.stringify(payload),
      );

      this.messagingService.notifyTransactionSystem(payload);
    });
  }

  getStatus(transaction: Transaction): TransactionStatus {
    const maxAmount = this.configService.get<number>(
      'application.business.transaction.max-amount',
    );
    const result =
      transaction.value > maxAmount
        ? TransactionStatus.rejected
        : TransactionStatus.approved;

    Logger.log('FraudAnalysisUsecase: newStatus: ' + result);
    return result;
  }
}
