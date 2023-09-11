import { Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from './domain.event';
import { EventBus } from '../../interface/event.bus';
import { KafkaProducerService } from './producer.service';

@Injectable()
export class KafkaEventBus implements EventBus {
  private readonly logger = new Logger(KafkaEventBus.name);

  constructor(private readonly producerService: KafkaProducerService) {}

  public async publish(event: DomainEvent): Promise<void> {
    try {
      await this.producerService.emit(event.event_name, event.message);
    } catch (e) {
      this.logger.error(`Error producing message to topic ${event.event_name}. Adding to dead letter queue...`, e);
    }
  }
}
