import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionType } from './transaction-type.entity';
import { TransactionStatus } from './transaction-status.entity';

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ name: 'transaction_external_id', type: 'uuid', nullable: false })
  transactionExternalId: string;

  @Column({ name: 'account_external_id_debit', type: 'uuid', nullable: true })
  accountExternalIdDebit: string;

  @Column({ name: 'account_external_id_credit', type: 'uuid', nullable: true })
  accountExternalIdCredit: string;

  @ManyToOne(() => TransactionType, { eager: true })
  @JoinColumn({ name: 'transaction_type_id' })
  transactionType: TransactionType;

  @Column({ name: 'value', nullable: false })
  value: number;

  @ManyToOne(() => TransactionStatus, { eager: true })
  @JoinColumn({ name: 'transaction_status_id' })
  transactionStatus: TransactionStatus;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: true,
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp',
    nullable: true,
  })
  updatedAt?: Date;
}
