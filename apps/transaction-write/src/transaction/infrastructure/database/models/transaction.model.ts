import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { TransactionStatusModel } from './status.model';
import { TransactionTypeModel } from './transaction-type.model';

@Entity('transaction')
export class TransactionModel {
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

  @ManyToOne(() => TransactionStatusModel, (status) => status.transactions)
  @JoinColumn({ name: 'transactionStatusId' })
  transactionStatus: TransactionStatusModel;

  @Column({ type: 'int' })
  transactionStatusId: number;

  @ManyToOne(
    () => TransactionTypeModel,
    (transactionType) => transactionType.transactions,
  )
  @JoinColumn({ name: 'transactionTypeId' })
  transactionType: TransactionTypeModel;

  @Column({ type: 'int' })
  transactionTypeId: number;
}
