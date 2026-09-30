import {
  Inject,
  Injectable,
  Logger,
  type OnApplicationShutdown,
} from '@nestjs/common';
import { type Consumer, type Kafka, type KafkaMessage } from 'kafkajs';
import { PoisonMessageError } from '../../application/errors/poison-message.error';
import {
  type ConsumedMessage,
  MessageConsumerPort,
  type SubscribeOptions,
} from '../../application/ports/message-consumer.port';
import { DomainError } from '../../domain/errors/domain.errors';
import { KAFKA_CLIENT } from '../tokens';
import { DeadLetterPublisher } from './dead-letter.publisher';
import { KafkaTopicInitializer } from './kafka-topic.initializer';
import { createRetryPolicy } from '../resilence';

@Injectable()
export class KafkaMessageConsumer
  extends MessageConsumerPort
  implements OnApplicationShutdown {
  private readonly logger = new Logger(KafkaMessageConsumer.name);
  private readonly consumers: Consumer[] = [];


  private readonly retryPolicy = createRetryPolicy({
    maxRetries: 4,
    initialDelayMs: 300,
    maxDelayMs: 5_000,
    retryable: (error) =>
      !(error instanceof PoisonMessageError) && !(error instanceof DomainError),
  });

  constructor(
    @Inject(KAFKA_CLIENT) private readonly kafka: Kafka,
    private readonly deadLetter: DeadLetterPublisher,
    private readonly topicInitializer: KafkaTopicInitializer,
  ) {
    super();
  }

  async subscribe(options: SubscribeOptions): Promise<void> {
    await this.topicInitializer.ensureTopics();
    const consumer = this.kafka.consumer({ groupId: options.groupId });
    this.consumers.push(consumer);

    await consumer.connect();
    await consumer.subscribe({ topic: options.topic, fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const consumed = this.toConsumed(topic, message);
        try {
          await this.retryPolicy.execute(() => options.handler(consumed));
        } catch (error) {
          await this.deadLetter.publish({
            consumerGroup: options.groupId,
            message: consumed,
            error,
          });
        }
      },
    });
    this.logger.log(
      `Subscribed to ${options.topic} (group ${options.groupId})`,
    );
  }

  async onApplicationShutdown(): Promise<void> {
    await Promise.allSettled(
      this.consumers.map((consumer) => consumer.disconnect()),
    );
  }

  private toConsumed(topic: string, message: KafkaMessage): ConsumedMessage {
    const headers: Record<string, string> = {};
    for (const [name, value] of Object.entries(message.headers ?? {})) {
      if (value === undefined) continue;
      headers[name] = Array.isArray(value)
        ? value.map((v) => v.toString()).join(',')
        : value.toString();
    }
    return {
      topic,
      key: message.key ? message.key.toString() : null,
      value: message.value ? message.value.toString() : '',
      headers,
    };
  }
}
