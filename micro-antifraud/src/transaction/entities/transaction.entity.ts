import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id_transaction: string;

  @Column('uuid')
  account_external_id_debit: string;

  @Column('uuid')
  account_external_id_credit: string;

  @Column('int')
  transfer_type_id: number;

  @Column('float')
  value: number;

  @Column('int')
  transfer_status_id: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
