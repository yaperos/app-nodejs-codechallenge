import { KAFKA_TOPICS } from '@app/shared';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KafkaEventsService } from '@kafka-events/kafka-events.service';

@Controller()
export class KafkaEventsController {
  constructor(private readonly kafkaEventsService: KafkaEventsService) {}

  @EventPattern(KAFKA_TOPICS.TRANSACTION_STATUS_APPROVED)
  async handleTransactionApproved(
    @Payload() data: { transactionId: string; statusCode: string },
  ) {
    console.log('Received transaction approved event:', data);
    await this.kafkaEventsService.handleTransactionApproved(data);
  }

  @EventPattern(KAFKA_TOPICS.TRANSACTION_STATUS_REJECTED)
  async handleTransactionRejected(
    @Payload() data: { transactionId: string; statusCode: string },
  ) {
    console.log('Received transaction rejected event:', data);
    await this.kafkaEventsService.handleTransactionRejected(data);
  }
}
