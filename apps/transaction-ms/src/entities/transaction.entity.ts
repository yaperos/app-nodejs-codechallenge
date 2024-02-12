import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionType } from './transaction-type.entity';
import { TransactionStatus } from './transaction-status.entity';
import { ColumnDecimalTransformer } from '../transformers/column-decimal.transformer';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid', { name: 'transactionexternalid' })
  transactionExternalId: string;

  @Column({ type: 'uuid', name: 'accountexternaliddebit', select: false })
  accountExternalIdDebit: string;

  @Column({ type: 'uuid', name: 'accountexternalidcredit', select: false })
  accountExternalIdCredit: string;

  @ManyToOne(() => TransactionType)
  @JoinColumn({ name: 'transactiontypeid' })
  transactionType: TransactionType;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    transformer: new ColumnDecimalTransformer(),
  })
  value: number;

  @ManyToOne(() => TransactionStatus)
  @JoinColumn({ name: 'transactionstatusid' })
  transactionStatus: TransactionStatus;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'createdat',
  })
  createdAt: Date;
}
