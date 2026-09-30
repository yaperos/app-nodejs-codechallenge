import { Injectable, Logger, type OnApplicationShutdown, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrokenCircuitError } from 'cockatiel';
import type { Env } from '../../config/env';
import { KafkaProducer } from '../messaging/kafka.producer';
import { PrismaService } from '../persistence/prisma/prisma.service';
import { createCircuitBreaker } from '../resilence';

interface OutboxRow {
    id: string;
    eventId: string;
    topic: string;
    key: string;
    payload: unknown;
}


@Injectable()
export class OutboxRelayService implements OnModuleInit, OnApplicationShutdown {
    private readonly logger = new Logger(OutboxRelayService.name);
    private readonly intervalMs: number;
    private readonly batchSize: number;
    private timer?: NodeJS.Timeout;
    private stopped = false;
    private inFlight: Promise<void> = Promise.resolve();

    private readonly breaker = createCircuitBreaker({
        name: 'outbox-relay',
        failureThreshold: 3,
        halfOpenAfterMs: 15_000,
    });

    constructor(
        private readonly prisma: PrismaService,
        private readonly producer: KafkaProducer,
        config: ConfigService<Env, true>,
    ) {
        this.intervalMs = config.get('OUTBOX_POLL_INTERVAL_MS', { infer: true });
        this.batchSize = config.get('OUTBOX_BATCH_SIZE', { infer: true });
    }

    onModuleInit(): void {
        this.schedule();
    }

    async onApplicationShutdown(): Promise<void> {
        this.stopped = true;
        if (this.timer) clearTimeout(this.timer);
        await this.inFlight;
    }

    private schedule(): void {
        if (this.stopped) return;
        this.timer = setTimeout(() => {
            this.inFlight = this.tick().finally(() => this.schedule());
        }, this.intervalMs);
    }

    private async tick(): Promise<void> {
        try {
            let relayed: number;
            do {
                relayed = await this.breaker.execute(() => this.relayBatch());
            } while (relayed === this.batchSize && !this.stopped);
        } catch (error) {
            if (error instanceof BrokenCircuitError) return;
            this.logger.error(`Outbox relay failed: ${(error as Error).message}`);
        }
    }

    private relayBatch(): Promise<number> {
        return this.prisma.$transaction(
            async (tx) => {
                const rows = await tx.$queryRaw<OutboxRow[]>`
          SELECT "id", "eventId", "topic", "key", "payload"
          FROM "OutboxEvent"
          WHERE "status" = 'PENDING'
          ORDER BY "createdAt" ASC
          LIMIT ${this.batchSize}
          FOR UPDATE SKIP LOCKED`;

                if (rows.length === 0) return 0;

                await this.producer.sendMany(
                    rows.map((row) => ({
                        topic: row.topic,
                        key: row.key,
                        value: JSON.stringify(row.payload),
                        headers: { 'event-id': row.eventId, 'content-type': 'application/json' },
                    })),
                );

                await tx.outboxEvent.updateMany({
                    where: { id: { in: rows.map((row) => row.id) } },
                    data: { status: 'SENT', sentAt: new Date() },
                });
                return rows.length;
            },
            { timeout: 30_000, maxWait: 5_000 },
        );
    }
}