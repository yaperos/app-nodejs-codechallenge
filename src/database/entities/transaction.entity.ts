import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionType } from './transaction-type.entity';
import { TransactionStatus } from './transaction-status.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transaction_external_id', type: 'uuid', unique: true })
  transactionExternalId: string;

  @Column({ name: 'account_external_id_debit', type: 'uuid' })
  accountExternalIdDebit: string;

  @Column({ name: 'account_external_id_credit', type: 'uuid' })
  accountExternalIdCredit: string;

  @Column({ name: 'transfer_type_id', type: 'int' })
  transferTypeId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ name: 'transaction_type_id', type: 'int' })
  transactionTypeId: number;

  @Column({ name: 'transaction_status_id', type: 'int' })
  transactionStatusId: number;

  @ManyToOne(() => TransactionType)
  @JoinColumn({ name: 'transaction_type_id' })
  transactionType: TransactionType;

  @ManyToOne(() => TransactionStatus)
  @JoinColumn({ name: 'transaction_status_id' })
  transactionStatus: TransactionStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
