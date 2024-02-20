import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TransactionStatus } from '../../domain/transaction.model';

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'transfer_type_id', type: 'double precision' })
  transferTypeId: number;

  @Column({ type: 'double precision' })
  value: number;

  @Column({ enum: TransactionStatus })
  status: TransactionStatus;

  @Column({ name: 'account_external_id_debit', type: 'uuid' })
  accountExternalIdDebit: string;

  @Column({ name: 'account_external_id_credit', type: 'uuid' })
  accountExternalIdCredit: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
