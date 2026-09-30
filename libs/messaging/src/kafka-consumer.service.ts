import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Consumer, Kafka, KafkaMessage } from 'kafkajs';
import { KafkaProducerService } from './kafka-producer.service';
import { KAFKA_OPTIONS, type KafkaOptions } from './kafka.config';

// Error que no vale la pena reintentar (payload inválido): va directo a la DLQ.
export class NonRetriableError extends Error {}

export interface SubscriptionOptions<T> {
  groupId: string;
  topic: string;
  deadLetterTopic: string;
  parse: (raw: unknown) => T;
  handle: (payload: T, key: string) => Promise<void>;
  maxAttempts?: number;
  baseBackoffMs?: number;
}

@Injectable()
export class KafkaConsumerService implements OnApplicationShutdown {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private readonly kafka: Kafka;
  private readonly consumers: Consumer[] = [];

  constructor(
    @Inject(KAFKA_OPTIONS) options: KafkaOptions,
    private readonly producer: KafkaProducerService,
  ) {
    this.kafka = new Kafka(options);
  }

  async subscribe<T>(options: SubscriptionOptions<T>): Promise<void> {
    const consumer = this.kafka.consumer({ groupId: options.groupId });
    this.consumers.push(consumer);
    await consumer.connect();
    await consumer.subscribe({ topic: options.topic, fromBeginning: true });

    // El offset se confirma solo cuando eachMessage termina: si el proceso muere
    // antes, Kafka reentrega el mensaje y el handler debe ser idempotente.
    await consumer.run({
      eachMessage: async ({ message }) => this.process(message, options),
    });
    this.logger.log(`Subscribed to ${options.topic} as ${options.groupId}`);
  }

  async onApplicationShutdown(): Promise<void> {
    await Promise.all(this.consumers.map((c) => c.disconnect()));
  }

  private async process<T>(
    message: KafkaMessage,
    options: SubscriptionOptions<T>,
  ): Promise<void> {
    const key = message.key?.toString() ?? '';
    const maxAttempts = options.maxAttempts ?? 3;
    const baseBackoffMs = options.baseBackoffMs ?? 200;

    for (let attempt = 1; ; attempt++) {
      try {
        const payload = options.parse(
          JSON.parse(message.value?.toString() ?? ''),
        );
        await options.handle(payload, key);
        return;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        const retriable =
          !(err instanceof NonRetriableError) && !(err instanceof SyntaxError);

        if (retriable && attempt < maxAttempts) {
          const delay = baseBackoffMs * 2 ** (attempt - 1);
          this.logger.warn(
            `${options.topic} key=${key} attempt ${attempt} failed: ${err.message}; retrying in ${delay}ms`,
          );
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        // Si la publicación a la DLQ falla se propaga el error: kafkajs no confirma
        // el offset y el mensaje se reintenta, nunca se pierde.
        await this.producer.send(options.deadLetterTopic, [
          {
            key,
            value: message.value?.toString() ?? null,
            headers: {
              'x-original-topic': options.topic,
              'x-error': err.message,
              'x-attempts': String(attempt),
            },
          },
        ]);
        this.logger.error(
          `${options.topic} key=${key} sent to ${options.deadLetterTopic}: ${err.message}`,
        );
        return;
      }
    }
  }
}
