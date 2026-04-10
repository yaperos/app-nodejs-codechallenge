import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('ledger_entries')
export class LedgerEntryEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'payment_id', type: 'uuid' })
  paymentId: string;

  @Column({ name: 'debit_account', type: 'varchar', length: 100 })
  debitAccount: string;

  @Column({ name: 'credit_account', type: 'varchar', length: 100 })
  creditAccount: string;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  amount: string;

  @Column({ type: 'varchar', length: 8 })
  currency: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
