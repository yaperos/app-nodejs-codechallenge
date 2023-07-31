import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus } from './transaction-status.entity';
import { TransactionType } from './transaction-type.entity';

@Entity({
  name: 'financial_transactions',
})
export class FinancialTransaction {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ name: 'value', default: 0 })
  public value!: number;

  @Column({ name: 'account_external_id_debit' })
  accountExternalIdDebit: string;

  @Column({ name: 'account_external_id_credit' })
  accountExternalIdCredit: string;

  @Index()
  @Column({ name: 'transaction_external_id' })
  transactionExternalId: string;

  @Index()
  @ManyToOne(() => TransactionStatus)
  @JoinColumn({ name: 'status_id' })
  public status!: TransactionStatus;

  @Index()
  @ManyToOne(() => TransactionType)
  @JoinColumn({ name: 'type_id' })
  public transactionType!: TransactionType;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;

  @DeleteDateColumn({ name: 'delete_at' })
  public deletedAt?: Date;
}
