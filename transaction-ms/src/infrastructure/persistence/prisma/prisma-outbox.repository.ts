import { Inject, Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { type OutboxMessage, OutboxRepositoryPort } from '../../../domain/ports/outbox.repository.port';
import { type DbClient, PrismaService } from './prisma.service';

@Injectable()
export class PrismaOutboxRepository extends OutboxRepositoryPort {
    constructor(@Inject(PrismaService) private readonly db: DbClient) {
        super();
    }

    async add(message: OutboxMessage): Promise<void> {
        await this.db.outboxEvent.create({
            data: {
                eventId: message.eventId,
                aggregateId: message.aggregateId,
                topic: message.topic,
                key: message.key,
                payload: message.payload as Prisma.InputJsonValue,
            },
        });
    }
}