import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('outbox_events')
export class OutboxEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventType: string;

  @Column('jsonb')
  payload: any;

  @Column('uuid')
  aggregateId: string;

  @Column({ default: false })
  processed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
