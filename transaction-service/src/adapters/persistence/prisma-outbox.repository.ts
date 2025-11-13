import { Injectable, Logger } from '@nestjs/common';
import { Outbox as PrismaOutbox, Prisma } from '@prisma/client';
import { PrismaService } from '@infra/prisma/prisma.service';
import { OutboxMessage, JsonValue  } from '@domain/outbox';
import { OutboxRepository } from '@ports/out/outbox-repository';

const toPrismaJson = (v: JsonValue): Prisma.InputJsonValue | Prisma.JsonNullValueInput =>
  v === null ? Prisma.JsonNull : (v as unknown as Prisma.InputJsonValue);

const fromPrismaJson = (v: unknown): JsonValue =>
  v as JsonValue;

const mapOutbox = (record: PrismaOutbox): OutboxMessage => ({
  id: record.id,
  topic: record.topic,
  key: record.key,
  payload: fromPrismaJson(record.payload),
  createdAt: record.createdAt,
  publishedAt: record.publishedAt,
  attempts: record.attempts,
  nextAttemptAt: record.nextAttemptAt,
});

@Injectable()
export class PrismaOutboxRepository implements OutboxRepository {
  private readonly logger = new Logger(PrismaOutboxRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async enqueue(message: OutboxMessage): Promise<void> {
    await this.prisma.outbox.create({
      data: {
        topic: message.topic,
        key: message.key,
        payload: toPrismaJson(message.payload),
        nextAttemptAt: message.nextAttemptAt ?? new Date(),
      },
    });
  }

  async dequeueBatch(limit: number): Promise<OutboxMessage[]> {
    const rows = await this.prisma.outbox.findMany({
      where: {
        publishedAt: null,
        nextAttemptAt: { lte: new Date() },
      },
      orderBy: [
        { nextAttemptAt: 'asc' },
        { createdAt: 'asc' },
      ],
      take: limit,
    });

    return rows.map(mapOutbox);
  }

  async markPublished(id: string): Promise<void> {
    await this.prisma.outbox.update({
      where: { id },
      data: { publishedAt: new Date() },
    });
  }

  async markFailed(id: string, attempts: number, nextAttemptAt: Date): Promise<void> {
    await this.prisma.outbox.update({
      where: { id },
      data: { attempts, nextAttemptAt },
    });
  }

  async withGlobalAdvisoryLock<T>(lockKey: bigint, task: () => Promise<T>): Promise<T | null> {
    const lockResult = await this.prisma.$queryRaw<{ locked: boolean }[]>`
      SELECT pg_try_advisory_lock(${lockKey}) AS locked;
    `;

    if (!lockResult[0]?.locked) {
      this.logger.debug(`Failed to acquire advisory lock ${lockKey.toString()}`);
      return null;
    }

    try {
      return await task();
    } finally {
      await this.prisma.$queryRaw`
        SELECT pg_advisory_unlock(${lockKey});
      `;
    }
  }
}
