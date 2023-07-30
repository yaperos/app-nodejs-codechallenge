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
