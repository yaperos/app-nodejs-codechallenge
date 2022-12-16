import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TransactionStatus } from './transaction_status.enum';

@Entity('transaction')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  value: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Column({ default: 0 })
  version: number;

  @Column({ default: 0 })
  status: TransactionStatus;

  @Column({ default: '' })
  accountExternalIdDebit: string;

  @Column({ default: '' })
  accountExternalIdCredit: string;

  @Column({ default: 0 })
  transferTypeId: number;
}
