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
  id_transaction: string;

  @Column('uuid', { nullable: false })
  account_external_id_debit: string;

  @Column('uuid', { nullable: false })
  account_external_id_credit: string;

  @Column('int', { nullable: false })
  transfer_type_id: number;

  @ManyToOne(() => TransactionTypeEntity, { eager: true })
  @JoinColumn({
    name: 'transfer_type_id',
    referencedColumnName: 'id_transaction_type',
  })
  transfer_type?: TransactionTypeEntity;

  @Column('float', { nullable: false })
  value: number;

  @Column('int', { nullable: false })
  transfer_status_id: number;

  @ManyToOne(() => TransactionStatusEntity, { eager: true })
  @JoinColumn({
    name: 'transfer_status_id',
    referencedColumnName: 'id_transaction_status',
  })
  transfer_status?: TransactionStatusEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
