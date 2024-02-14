import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

export enum TransactionStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

@Entity({ name: 'transactions' })
export class Transaction {
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

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;
}
