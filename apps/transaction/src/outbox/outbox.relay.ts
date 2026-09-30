import { KafkaProducerService } from '@app/messaging';
import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

interface OutboxRow {
  id: string;
  aggregate_id: string;
  topic: string;
  payload: unknown;
}

@Injectable()
export class OutboxRelay
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(OutboxRelay.name);
  private readonly pollMs: number;
  private readonly batchSize: number;
  private timer?: NodeJS.Timeout;
  private running = false;
  private stopped = false;

  constructor(
    private readonly dataSource: DataSource,
    private readonly producer: KafkaProducerService,
    config: ConfigService,
  ) {
    this.pollMs = Number(config.get('OUTBOX_POLL_MS', 200));
    this.batchSize = Number(config.get('OUTBOX_BATCH_SIZE', 100));
  }

  onApplicationBootstrap(): void {
    this.schedule(0);
  }

  async onApplicationShutdown(): Promise<void> {
    this.stopped = true;
    clearTimeout(this.timer);
    while (this.running) await new Promise((r) => setTimeout(r, 50));
  }

  private schedule(delayMs: number): void {
    if (this.stopped) return;
    this.timer = setTimeout(() => void this.tick(), delayMs);
  }

  private async tick(): Promise<void> {
    this.running = true;
    let published = 0;
    try {
      published = await this.publishBatch();
    } catch (error) {
      this.logger.error(`Outbox relay failed: ${(error as Error).message}`);
    } finally {
      this.running = false;
      // Lote lleno → probablemente hay más pendiente: se sigue sin esperar.
      this.schedule(published === this.batchSize ? 0 : this.pollMs);
    }
  }

  // SKIP LOCKED permite varias instancias del relay sin publicar dos veces la misma fila.
  // Si Kafka falla, el rollback libera las filas y el próximo tick las reintenta.
  async publishBatch(): Promise<number> {
    return this.dataSource.transaction(async (em) => {
      const rows: OutboxRow[] = await em.query(
        `SELECT id, aggregate_id, topic, payload FROM outbox
         WHERE published_at IS NULL
         ORDER BY id
         LIMIT $1
         FOR UPDATE SKIP LOCKED`,
        [this.batchSize],
      );
      if (rows.length === 0) return 0;

      const byTopic = new Map<string, OutboxRow[]>();
      for (const row of rows) {
        byTopic.set(row.topic, [...(byTopic.get(row.topic) ?? []), row]);
      }
      for (const [topic, topicRows] of byTopic) {
        await this.producer.send(
          topic,
          topicRows.map((r) => ({
            key: r.aggregate_id,
            value: JSON.stringify(r.payload),
          })),
        );
      }

      await em.query(
        `UPDATE outbox SET published_at = now() WHERE id = ANY($1::bigint[])`,
        [rows.map((r) => r.id)],
      );
      return rows.length;
    });
  }
}
