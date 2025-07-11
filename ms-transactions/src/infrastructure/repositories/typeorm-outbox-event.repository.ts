import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OutboxEvent,
  OutboxEventRepository,
} from '../../domain/repositories/outbox-event.repository';
import { RepositoryTransactionContext } from '../../domain/repositories/transaction-context';
import { OutboxEventEntity } from './entities/outbox-event.entity';

@Injectable()
export class TypeOrmOutboxEventRepository implements OutboxEventRepository {
  constructor(
    @InjectRepository(OutboxEventEntity)
    private readonly repository: Repository<OutboxEventEntity>,
  ) {}

  async create(
    event: OutboxEvent,
    context?: RepositoryTransactionContext,
  ): Promise<OutboxEvent> {
    const manager = context?.transactionManager || this.repository.manager;

    const entity = manager.create(OutboxEventEntity, {
      eventType: event.eventType,
      payload: event.payload,
      aggregateId: event.aggregateId,
      processed: event.processed,
      createdAt: event.createdAt || new Date(),
    });

    const savedEntity = await manager.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async findUnprocessed(
    context?: RepositoryTransactionContext,
  ): Promise<OutboxEvent[]> {
    const manager = context?.transactionManager || this.repository.manager;

    const entities = await manager.find(OutboxEventEntity, {
      where: { processed: false },
    });

    return entities.map((entity) => this.mapToDomain(entity));
  }

  async markAsProcessed(
    id: string,
    context?: RepositoryTransactionContext,
  ): Promise<void> {
    const manager = context?.transactionManager || this.repository.manager;

    await manager.update(OutboxEventEntity, id, { processed: true });
  }

  private mapToDomain(entity: OutboxEventEntity): OutboxEvent {
    return {
      id: entity.id.toString(),
      eventType: entity.eventType,
      payload: entity.payload as Record<string, unknown>,
      aggregateId: entity.aggregateId,
      processed: entity.processed,
      createdAt: entity.createdAt,
    };
  }
}
