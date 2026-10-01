import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Consumer, Kafka, KafkaMessage } from 'kafkajs';
import { isTransientError, NonRetriableError } from './error-classification';
import { KafkaProducerService } from './kafka-producer.service';
import { KAFKA_OPTIONS, type KafkaOptions } from './kafka.config';

const MAX_TRANSIENT_BACKOFF_MS = 30_000;
const HEARTBEAT_EVERY_MS = 3_000;

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
  private stopping = false;

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
      eachMessage: async (batch) =>
        this.process(batch.message, () => batch.heartbeat(), options),
    });
    this.logger.log(`Subscribed to ${options.topic} as ${options.groupId}`);
  }

  async onApplicationShutdown(): Promise<void> {
    this.stopping = true;
    await Promise.all(this.consumers.map((c) => c.disconnect()));
  }

  private async process<T>(
    message: KafkaMessage,
    heartbeat: () => Promise<void>,
    options: SubscriptionOptions<T>,
  ): Promise<void> {
    const key = message.key?.toString() ?? '';
    const maxAttempts = options.maxAttempts ?? 5;
    const baseBackoffMs = options.baseBackoffMs ?? 200;

    let payload: T;
    try {
      payload = options.parse(JSON.parse(message.value?.toString() ?? ''));
    } catch (error) {
      // Mensaje mal formado: reintentarlo nunca lo va a arreglar.
      return this.deadLetter(message, key, options, error, 1);
    }

    for (let attempt = 1; ; attempt++) {
      try {
        await options.handle(payload, key);
        return;
      } catch (error) {
        const message_ = error instanceof Error ? error.message : String(error);
        const delay = Math.min(
          baseBackoffMs * 2 ** (attempt - 1),
          MAX_TRANSIENT_BACKOFF_MS,
        );

        // Infraestructura caída: se bloquea la partición y se reintenta sin límite.
        // Todo lo que viene detrás fallaría igual; al volver la BD nada se perdió.
        if (isTransientError(error)) {
          this.logger.warn(
            `${options.topic} key=${key} infrastructure unavailable (attempt ${attempt}): ${message_}; retrying in ${delay}ms`,
          );
          await this.wait(delay, heartbeat);
          continue;
        }

        if (!(error instanceof NonRetriableError) && attempt < maxAttempts) {
          this.logger.warn(
            `${options.topic} key=${key} attempt ${attempt} failed: ${message_}; retrying in ${delay}ms`,
          );
          await this.wait(delay, heartbeat);
          continue;
        }

        return this.deadLetter(message, key, options, error, attempt);
      }
    }
  }

  // Espera manteniendo vivo el heartbeat, para que Kafka no saque al consumidor del grupo.
  // Si la app se está apagando se aborta sin confirmar el offset: el mensaje se reentrega.
  private async wait(
    ms: number,
    heartbeat: () => Promise<void>,
  ): Promise<void> {
    const until = Date.now() + ms;
    while (Date.now() < until) {
      if (this.stopping) throw new Error('Consumer shutting down');
      await new Promise((r) =>
        setTimeout(r, Math.min(HEARTBEAT_EVERY_MS, until - Date.now())),
      );
      await heartbeat().catch(() => undefined);
    }
  }

  // Si la publicación a la DLQ falla se propaga el error: kafkajs no confirma
  // el offset y el mensaje se reintenta, nunca se pierde.
  private async deadLetter<T>(
    message: KafkaMessage,
    key: string,
    options: SubscriptionOptions<T>,
    error: unknown,
    attempts: number,
  ): Promise<void> {
    const reason = error instanceof Error ? error.message : String(error);
    await this.producer.send(options.deadLetterTopic, [
      {
        key,
        value: message.value?.toString() ?? null,
        headers: {
          'x-original-topic': options.topic,
          'x-error': reason,
          'x-attempts': String(attempts),
        },
      },
    ]);
    this.logger.error(
      `${options.topic} key=${key} sent to ${options.deadLetterTopic}: ${reason}`,
    );
  }
}
