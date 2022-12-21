import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessagingService } from 'src/adapter/input_output/messaging/messaging.service';
import { TransactionService } from '../../adapter/output/db/transaction.service';
import { AntifraudAnalysisResponsePayload } from '../models/events/antifraud_analysis_response.payload';

@Injectable()
export class UpdateTransactionAfterValidationUsecase implements OnModuleInit {
  onModuleInit() {
    // Consumer for topic "antifraud-analysis-response"
    const antifraudAnalysisResponseTopic = this.configService.get(
      'application.transport.event-driven.kafka.topics.antifraud-analysis-response',
    );

    this.messagingService.addTopicConsumer(
      antifraudAnalysisResponseTopic,
      (msg) => {
        const analysisResponse: AntifraudAnalysisResponsePayload = JSON.parse(
          msg.value.toString(),
        );
        Logger.log(
          `UpdateTransactionAfterValidationUsecase antifraud-analysis-response ` +
            `payload.transactionId : ${analysisResponse.transactionId}`,
        );

        this.update(analysisResponse);
      },
    );

    this.messagingService.subscribeConsumers();
  }

  constructor(
    private messagingService: MessagingService,
    private transactionService: TransactionService,
    private configService: ConfigService,
  ) {}

  update(antifrauAnalysisResponse: AntifraudAnalysisResponsePayload) {
    Logger.log(
      'UpdateTransactionAfterValidationUsecase: received ' +
        JSON.stringify(antifrauAnalysisResponse),
    );

    return this.transactionService
      .update(
        antifrauAnalysisResponse.transactionId,
        antifrauAnalysisResponse.version,
        antifrauAnalysisResponse.newStatus,
      )
      .subscribe((updateResult) => {
        /**
         * It is not part of the requirements.
         * 
         * If not update (updateResult.affected == 0)
         * you could:
         * * Notify by email about failed transaction
         * * Queue rejected transaction id for post processing
         */
        Logger.log(
          'UpdateTransactionAfterValidationUsecase: updated record result ' +
            JSON.stringify(updateResult),
        );
      });
  }
}
