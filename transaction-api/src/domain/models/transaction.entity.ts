import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TransferType } from './transfer-type.enum';
import { TransactionStatus } from './transaction-status.enum';
import { AggregateRoot } from '@nestjs/cqrs';
import { TransactionStatusChangedToPendingEvent } from '../events/transaction-status-changed-to-pending.event';

@Entity()
export class Transaction extends AggregateRoot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TransferType,
    default: TransferType.NONE,
  })
  transferType: TransferType;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  value: number;

  @Column('uuid')
  accountExternalIdDebit: string;

  @Column('uuid')
  accountExternalIdCredit: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column()
  createdAt: Date;

  get transferTypeName() {
    switch (this.transferType) {
      case TransferType.CREDIT:
        return 'credit';
      case TransferType.DEBIT:
        return 'debit';
      default:
        return '';
    }
  }

  get transferStatusName() {
    switch (this.status) {
      case TransactionStatus.PENDING:
        return 'pending';
      case TransactionStatus.REJECTED:
        return 'rejected';
      case TransactionStatus.APPROVED:
        return 'approved';
      default:
        return '';
    }
  }

  notifyPendingStatus() {
    if (this.status === TransactionStatus.PENDING) {
      this.apply(
        new TransactionStatusChangedToPendingEvent(this.id, this.value),
      );
    }
  }
}
