import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';

import { TransactionStatus } from './status.entity';
import { TransactionType } from './transaction-type.entity';

@Entity()
@Index('idx_transaction_type_name', ['transactionType'])
@Index('idx_transaction_status_name', ['transactionStatus'])
@Index('idx_transaction_value', ['value'])
@Index('idx_transaction_created_at', ['createdAt'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Column({ type: 'uuid' })
  accountExternalIdDebit: string;

  @Column({ type: 'uuid' })
  accountExternalIdCredit: string;

  @Column({ type: 'decimal' })
  value: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => TransactionStatus, (status) => status.transactions)
  @JoinColumn({ name: 'transactionStatusId' })
  transactionStatus: TransactionStatus;

  @Column({ type: 'int' })
  transactionStatusId: number;

  @ManyToOne(
    () => TransactionType,
    (transactionType) => transactionType.transactions,
  )
  @JoinColumn({ name: 'tranferTypeId' })
  transactionType: TransactionType;

  @Column({ type: 'int' })
  tranferTypeId: number;
}
