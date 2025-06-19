import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionTypeOrmEntity } from './transaction-type.entity';
import { TransactionStatusOrmEntity } from './transaction-status.entity';

@Entity('transactions')
export class TransactionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transaction_external_id', unique: true })
  transactionExternalId: string;

  @Column({ name: 'account_external_id_debit' })
  accountExternalIdDebit: string;

  @Column({ name: 'account_external_id_credit' })
  accountExternalIdCredit: string;

  @Column({ name: 'transfer_type_id' })
  tranferTypeId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @ManyToOne(() => TransactionTypeOrmEntity, { eager: true })
  @JoinColumn({ name: 'transfer_type_id' })
  transactionType: TransactionTypeOrmEntity;

  @ManyToOne(() => TransactionStatusOrmEntity, { eager: true })
  @JoinColumn({ name: 'status_id' })
  transactionStatus: TransactionStatusOrmEntity;

  @Column({ name: 'status_id', default: 1 }) // 1 = pending
  statusId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 