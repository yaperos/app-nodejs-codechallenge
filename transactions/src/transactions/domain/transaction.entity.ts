import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum TransferType {
  DEPOSIT = '1',
  WITHDRAW = '2',
  TRANSFER = '3',
}

export enum TransactionStatus {
  Pending = 'pending',
  Approved = 'approved',
  Failed = 'failed',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  externalId: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.Pending,
  })
  status: TransactionStatus;

  @Column({ type: 'uuid' })
  @Index()
  accountExternalIdDebit: string;

  @Column({ type: 'uuid' })
  @Index()
  accountExternalIdCredit: string;

  @Column({ type: 'enum', enum: TransferType })
  transferTypeId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
