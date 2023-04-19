import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { YapeTransactionType } from './transaction-type.entity';
import { TransactionStatus } from './transaction-status.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'account_external_id_debit',
    type: 'varchar',
    nullable: true,
    unique: false,
  })
  accountExternalIdDebit: string;

  @Column({
    name: 'account_external_id_credit',
    type: 'varchar',
    nullable: true,
    unique: false,
  })
  accountExternalIdCredit: string;

  @ManyToOne(() => YapeTransactionType)
  @JoinColumn({ name: 'transfer_type_id' })
  transferType: YapeTransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ name: 'transaction_external_id', type: 'uuid' })
  transactionExternalId: string;

  @ManyToOne(() => TransactionStatus)
  @JoinColumn({ name: 'transaction_status_id' })
  transactionStatus: TransactionStatus;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
