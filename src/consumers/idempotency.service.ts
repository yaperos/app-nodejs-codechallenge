import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsumerProcessedEventEntity } from '../payments/entities/consumer-processed-event.entity';

@Injectable()
export class IdempotencyService {
  constructor(
    @InjectRepository(ConsumerProcessedEventEntity)
    private readonly processedRepository: Repository<ConsumerProcessedEventEntity>,
  ) {}

  async hasProcessed(consumerName: string, eventId: string): Promise<boolean> {
    const record = await this.processedRepository.findOne({
      where: { consumerName, eventId },
    });
    return Boolean(record);
  }

  async markProcessed(consumerName: string, eventId: string, aggregateId: string): Promise<void> {
    const entity = this.processedRepository.create({
      consumerName,
      eventId,
      aggregateId,
      processedAt: new Date(),
    });
    await this.processedRepository.save(entity);
  }
}
