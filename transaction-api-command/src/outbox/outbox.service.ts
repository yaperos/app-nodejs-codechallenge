import { Injectable, Logger } from '@nestjs/common';
import { ProducerService } from 'src/kafka/producer.service';
import { DataBaseService } from 'src/database/database.service';

@Injectable()
export class OutboxRelayService {
  private readonly logger = new Logger(OutboxRelayService.name);

  constructor(
    private databaseService: DataBaseService,
    private producerService: ProducerService,
  ) {}

  async relayMessages() {
    let messages = [];

    try {
      messages = await this.databaseService.getOutboxMessages();

      if (messages.length === 0) {
        this.logger.log('No messages to relay');
        return;
      }
    } catch (error) {
      this.logger.error(
        'Failed fetching outbox messages from database',
        error.message,
      );
    }

    for (const message of messages) {
      try {
        await this.producerService.produce(message.topic, {
          key: message.key,
          value: message.value,
        });

        this.logger.log(`published ${message.topic} ${message.key}`);
      } catch (error) {
        this.logger.error(
          'Failed sending message from producer to Kafka',
          error.message,
        );
      }
    }
  }
}
