import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus, TransactionType } from '.';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'account_external_id_debit' })
  accountExternalIdDebit: string;

  @Column({ name: 'account_external_id_credit' })
  accountExternalIdCredit: string;

  @Column()
  value: number;

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
