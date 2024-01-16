import {
  Column,
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from './account.entity';

export enum TransactionStatus {
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Pending = 'PENDING',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  created_at?: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @Column({ type: 'integer' })
  transfer_type_id: number;

  @Column({ type: 'integer' })
  value: number;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @ManyToOne(() => Account)
  @JoinColumn({
    name: 'account_external_id_debit_id',
    referencedColumnName: 'id',
  })
  account_external_id_debit: Account;

  @ManyToOne(() => Account)
  @JoinColumn({
    name: 'account_external_id_credit_id',
    referencedColumnName: 'id',
  })
  account_external_id_credit: Account;
}
