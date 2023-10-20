import { Controller, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { Client, ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { microServiceKafka } from '../../../core-library/src/config/kafka.service';
import { KafkaConstants } from '../../../core-library/src/common/constants/kafka.constant';
import { TransactionService } from '../core/transaction.service';




@Controller('kafka')
export class KafkaListener implements OnModuleInit {
  @Client(microServiceKafka)
  client: ClientKafka;

  @Inject()
  private logger: Logger;

  constructor(
    private readonly transactionService: TransactionService
  ) {}

  onModuleInit() {
    this.client.subscribeToResponseOf(KafkaConstants.Fraud.RESPONSE_TOPIC);
  }

  @EventPattern(KafkaConstants.Fraud.RESPONSE_TOPIC)
  async handleMessageRequest(@Payload() message: any) {
    this.logger.log(`::Message from fraud:: ${JSON.stringify(message)}`);
    this.transactionService.update(message);
  }
}