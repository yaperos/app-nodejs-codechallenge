import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus, TransactionType } from '.';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'account_external_id_debit' })
  accountExternalIdDebit: string;

  @Column({ name: 'account_external_id_credit' })
  accountExternalIdCredit: string;

  @Generated('uuid')
  @Index('index_transaction_external_id')
  @Column()
  transactionExternalId: string;

  @Column({ type: 'float' })
  value: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(
    () => TransactionType,
    (transactionType) => transactionType.transactions,
    { nullable: false },
  )
  transactionType: TransactionType;

  @ManyToOne(
    () => TransactionStatus,
    (transactionStatus) => transactionStatus.transactions,
    { nullable: false },
  )
  transactionStatus: TransactionStatus;
}
