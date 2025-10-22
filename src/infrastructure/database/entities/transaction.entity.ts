import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { TransactionStatus, TransactionType } from '../../../domain/entities/transaction.entity';

@Entity('transactions')
@Index('idx_external_id', ['externalId'], { unique: true })
@Index('idx_idempotency_key', ['idempotencyKey'], { unique: true })
@Index('idx_status', ['status'])
@Index('idx_source_account', ['sourceAccountId'])
@Index('idx_target_account', ['targetAccountId'])
@Index('idx_created_at', ['createdAt'])
@Index('idx_status_created', ['status', 'createdAt'])
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'external_id', unique: true, type: 'varchar' })
  externalId: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.P2P,
  })
  type: TransactionType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 3, default: 'PEN', type: 'varchar' })
  currency: string;

  @Column({ name: 'source_account_id', type: 'varchar' })
  sourceAccountId: string;

  @Column({ name: 'target_account_id', type: 'varchar' })
  targetAccountId: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column('jsonb', { default: {} })
  metadata: Record<string, string | number | boolean>;

  @Column({ name: 'antifraud_score', nullable: true, type: 'float' })
  antifraudScore: number | null;

  @Column({ name: 'antifraud_status', nullable: true, type: 'varchar' })
  antifraudStatus: string | null;

  @Column({ name: 'antifraud_checked_at', nullable: true, type: 'timestamp' })
  antifraudCheckedAt: Date | null;

  @Column({ name: 'retry_count', default: 0 })
  retryCount: number;

  @Column({ name: 'idempotency_key', nullable: true, type: 'varchar' })
  idempotencyKey: string | null;

  @Column({ name: 'failure_reason', nullable: true, type: 'text' })
  failureReason: string | null;

  @Column({ name: 'completed_at', nullable: true, type: 'timestamp' })
  completedAt: Date | null;

  @Column({ name: 'reversed_at', nullable: true, type: 'timestamp' })
  reversedAt: Date | null;

  @Column({ name: 'reversal_transaction_id', nullable: true, type: 'varchar' })
  reversalTransactionId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  convertAmountToNumber() {
    if (this.amount) {
      this.amount = Number(this.amount);
    }
  }
}