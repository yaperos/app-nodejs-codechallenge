import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FinancialTransactionType } from '@/transactions/entities/financial-transaction-type.entity';
import { FinancialTransactionStatuses } from '@/transactions/enums/financial-transaction-statuses.enum';

@Entity({ name: 'transaction' })
export class FinancialTransaction {
  @PrimaryGeneratedColumn()
  transactionId: number;

  @Column({ default: null, type: 'uuid' })
  transactionExternalId: string;

  @ManyToOne(() => FinancialTransactionType)
  @JoinColumn({ name: 'transactionTypeId' })
  transactionType: FinancialTransactionType;

  @Column({
    type: 'enum',
    enum: FinancialTransactionStatuses,
    default: FinancialTransactionStatuses.pending,
  })
  transactionStatus: string;

  @Column('decimal', { precision: 8, scale: 2 })
  value: number;

  @Column({ type: 'uuid' })
  accountExternalIdDebit: string;

  @Column({ type: 'uuid' })
  accountExternalIdCredit: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
