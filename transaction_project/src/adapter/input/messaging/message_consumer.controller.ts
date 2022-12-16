import { Controller, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessagingService } from '../../input_output/messaging/mesaging.service';
import { AntifraudAnalysisResponsePayload } from './antifraud_analysis_response.payload';
import { UpdateTransactionAfterValidationUsecase } from 'src/domain/usecases/update_transaction_after_validation.usecase';

@Controller()
export class MessageConsumerController
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly configService: ConfigService,
    private readonly updateUsecase: UpdateTransactionAfterValidationUsecase,
    private readonly messageService: MessagingService,
  ) {}

  async onModuleInit() {
    console.log('MessageConsumerController::onModuleInit');

    const consumer = this.messageService.getConsumer();
    await consumer.connect();

    // Consumers
    console.log('MessageConsumerController - consumers');

    // Consumer for topic "antifraud-analysis-response"
    const antifraudAnalysisResponseTopic = this.configService.get(
      'application.transport.event-driven.kafka.topics.antifraud-analysis-response',
    );

    this.messageService.addTopicConsumer(
      antifraudAnalysisResponseTopic,
      (msg) => {
        const analysisResponse: AntifraudAnalysisResponsePayload = JSON.parse(
          msg.value.toString(),
        );
        console.log(
          `MessageConsumerController antifraud-analysis-response ` +
            `payload.transactionId : ${analysisResponse.transactionId}`,
        );

        this.updateUsecase.update(analysisResponse);
      },
    );
  }

  async onModuleDestroy() {
    this.messageService.getConsumer().disconnect();
  }
}
