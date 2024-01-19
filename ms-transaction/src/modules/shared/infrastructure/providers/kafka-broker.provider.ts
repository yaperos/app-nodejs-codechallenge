import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DomainEvent } from 'src/modules/shared/domain/domain-event';
import {
  BrokerProvider,
  KAFKA_BROKER,
} from 'src/modules/shared/domain/providers/broker.provider';

export class KafkaBrokerProvider implements BrokerProvider {
  private readonly logger = new Logger(KafkaBrokerProvider.name);
  constructor(
    @Inject(KAFKA_BROKER)
    private readonly kafka: ClientKafka,
  ) {}

  async publishEvent(event: DomainEvent<any>): Promise<void> {
    try {
      const data = JSON.stringify(event);
      await firstValueFrom(this.kafka.emit(event.eventName, data));
      this.logger.log(`Message sent: ${data}`);
    } catch (error) {
      this.logger.error(error.message, error.stack, event);
    }
  }
}
