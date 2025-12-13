import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TransactionType } from './TransactionType';
import { TransactionStatus } from './TransactionStatus';

// Entidad principal de transacciones
@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid', { name: 'transaction_external_id' })
  transactionExternalId!: string;

  @Column('uuid', { name: 'account_external_id_debit' })
  accountExternalIdDebit!: string;

  @Column('uuid', { name: 'account_external_id_credit' })
  accountExternalIdCredit!: string;

  @Column('int', { name: 'transfer_type_id' })
  transferTypeId!: number;

  @Column('decimal', { precision: 15, scale: 2, name: 'value' })
  value!: number;

  @ManyToOne(() => TransactionType)
  @JoinColumn({ name: 'transaction_type_id' })
  transactionType!: TransactionType;

  @ManyToOne(() => TransactionStatus)
  @JoinColumn({ name: 'transaction_status_id' })
  transactionStatus!: TransactionStatus;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;
}
