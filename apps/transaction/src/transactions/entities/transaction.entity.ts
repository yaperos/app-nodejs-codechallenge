import { TransactionStatus } from '@app/contracts';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransferType } from './transfer-type.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryColumn('uuid', { name: 'transaction_external_id' })
  transactionExternalId!: string;

  @Column('uuid', { name: 'account_external_id_debit' })
  accountExternalIdDebit!: string;

  @Column('uuid', { name: 'account_external_id_credit' })
  accountExternalIdCredit!: string;

  @Column('int', { name: 'transfer_type_id' })
  transferTypeId!: number;

  @ManyToOne(() => TransferType, { eager: true })
  @JoinColumn({ name: 'transfer_type_id' })
  transferType!: TransferType;

  // pg devuelve numeric como string para no perder precisión.
  @Column('numeric', { precision: 18, scale: 2 })
  value!: string;

  @Column({ type: 'varchar', length: 20 })
  status!: TransactionStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
