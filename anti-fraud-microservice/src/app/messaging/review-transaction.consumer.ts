import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KafkaProducerService } from '../../infrastructure/config/messaging/kafka.producer';
import { TOPICS, ReviewedTransactionEvent } from '../../shared/topics';

@Controller()
export class ReviewTransactionConsumer {
  constructor(private readonly kafka: KafkaProducerService) {}

  @EventPattern(TOPICS.CREATE)
  async onCreate(@Payload() message: any) {  
    const status: ReviewedTransactionEvent['status'] =
      message.value > 1000 ? 'REJECTED' : 'APPROVED';

    const out: ReviewedTransactionEvent = {
      transactionExternalId: message.transactionExternalId,
      status,
      reviewedAt: new Date().toISOString(),
    };

    const topic = status === 'APPROVED' ? TOPICS.APPROVED : TOPICS.REJECTED;
    await this.kafka.emit(topic, out, message.transactionExternalId);
  }
}