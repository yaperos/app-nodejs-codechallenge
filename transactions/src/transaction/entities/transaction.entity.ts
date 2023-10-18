import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionTypeEntity } from '../../transaction-type/entities/transaction-type.entity';
import { TransactionStatusEntity } from '../../transaction-status/entities/transaction-status.entity';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transaction_external_id: string;

  @Column('uuid', { nullable: false })
  account_external_id_debit: string;

  @Column('uuid', { nullable: false })
  account_external_id_credit: string;

  @Column('int', { nullable: false })
  transaction_type_id: number;

  @ManyToOne(() => TransactionTypeEntity, { eager: true })
  @JoinColumn({
    name: 'transaction_type_id',
    referencedColumnName: 'transaction_type_id',
  })
  transaction_type?: TransactionTypeEntity;

  @Column('float', { nullable: false })
  value: number;

  @Column('int', { nullable: false })
  transaction_status_id: number;

  @ManyToOne(() => TransactionStatusEntity, { eager: true })
  @JoinColumn({
    name: 'transaction_status_id',
    referencedColumnName: 'transaction_status_id',
  })
  transaction_status?: TransactionStatusEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
