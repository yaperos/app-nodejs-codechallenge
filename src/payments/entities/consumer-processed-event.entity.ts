import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('consumer_processed_events')
export class ConsumerProcessedEventEntity {
  @PrimaryColumn({ name: 'consumer_name', type: 'varchar', length: 100 })
  consumerName: string;

  @PrimaryColumn({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @Column({ name: 'aggregate_id', type: 'uuid' })
  aggregateId: string;

  @Column({ name: 'processed_at', type: 'timestamp', default: () => 'NOW()' })
  processedAt: Date;
}
