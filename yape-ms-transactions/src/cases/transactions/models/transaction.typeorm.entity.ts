import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @PrimaryColumn({ name: 'transaction_id' })
  id: string;

  @Column('uuid', { name: 'account_external_id_debit' })
  accountExternalIdDebit: string;

  @Column('uuid', { name: 'account_external_id_credit' })
  accountExternalIdCredit: string;

  @Column('int', { name: 'transfer_type_id' })
  transferTypeId: number;

  @Column('decimal', { precision: 12, scale: 2, name: 'value' })
  value: string;

  @Column({ type: 'varchar', length: 32, default: 'PENDING', name: 'status' })
  transactionStatusName: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
