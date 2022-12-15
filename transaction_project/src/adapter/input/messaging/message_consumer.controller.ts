import { Controller, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { AntifraudAnalysisResponsePayload } from './antifraud_analysis_response.payload';
import { UpdateTransactionAfterValidationUsecase } from 'src/domain/usecases/update_transaction_after_validation.usecase';
import { KafkaService } from './kafka.service';

@Controller()
export class MessageConsumerController
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly updateUsecase: UpdateTransactionAfterValidationUsecase,
    private readonly kafkaService: KafkaService,
  ) {}

  async onModuleInit() {
    console.log('MessageConsumerController::onModuleInit');

    const consumer = this.kafkaService.getConsumer();
    await consumer.connect();

    // Consumers
    console.log('MessageConsumerController - consumers');

    // Consumer for topic "antifraud-analysis-response"
    await this.kafkaService.consume(
      consumer,
      'antifraud-analysis-response',
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
    this.kafkaService.getConsumer().disconnect();
  }
}


