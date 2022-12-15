import { Controller, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ConfigService } from '@nestjs/config';
import { AntifraudCheckPayload } from './antifraud_check.payload';
import { FraudAnalysisUsecase } from '../../../domain/usecases/fraud_analysis.usecase';

@Controller()
export class MessageConsumerController
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly configService: ConfigService,
    private readonly fraudAnalysisUsecase: FraudAnalysisUsecase,
    private readonly kafkaService: KafkaService,
  ) {}

  async onModuleInit() {
    console.log('MessageConsumerController::onModuleInit');

    const consumer = this.kafkaService.getConsumer();
    await consumer.connect();

    // Consumers
    console.log('MessageConsumerController - consumers');

    // Consumer for topic "antifraud-check"
    const antifraudCheckTopic = this.configService.get(
      'application.transport.event-driven.kafka.topics.antifraud-check',
    );
    await this.kafkaService.consume(consumer, antifraudCheckTopic, (msg) => {
      const checkPayload: AntifraudCheckPayload = JSON.parse(
        msg.value.toString(),
      );
      console.log(
        `>> ANTIFRAUD AntifraudConsumerController: read incoming message ` +
          `${JSON.stringify(checkPayload)}`,
      );

      const transactionId: number = checkPayload.transactionId;
      this.fraudAnalysisUsecase.analyze(transactionId);
    });
  }

  async onModuleDestroy() {
    this.kafkaService.getConsumer().disconnect();
  }
}
