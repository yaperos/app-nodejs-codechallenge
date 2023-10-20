import { Controller, Inject, OnModuleInit, Logger, OnModuleDestroy } from '@nestjs/common';
import { Client, ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { microServiceKafka } from '../../../core-library/src/config/kafka.service';
import { MessageValidatorService } from '../core/message-validator.service';
import { KafkaConstants } from '../../../core-library/src/common/constants/kafka.constant';

@Controller('kafka')
export class FraudKafkaListener implements OnModuleInit, OnModuleDestroy {
  @Client(microServiceKafka)
  client: ClientKafka;

  @Inject()
  private logger: Logger;

  constructor(
    private readonly messageValidatorService: MessageValidatorService
  ) {}

  onModuleInit() {
    this.client.subscribeToResponseOf(KafkaConstants.Fraud.REQUEST_TOPIC);
    this.logger.log(`Request topic: ${KafkaConstants.Fraud.REQUEST_TOPIC}`);
  }

  onModuleDestroy() {
    this.client.close();
  }

  @EventPattern(KafkaConstants.Fraud.REQUEST_TOPIC)
  async handleMessageRequest(@Payload() message: any) {
    this.logger.log(`::Message from transaction:: ${JSON.stringify(message)}`);
    this.messageValidatorService.validateTransaction(message);
  }
}