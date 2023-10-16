import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Column({ name: 'transaction_id', primary: true, unique: true })
  transferId?: string;
  @Column({ name: 'request_id', unique: true })
  requestId: string;
  @Column({ name: 'external_credit_id' })
  accountExternalIdDebit: string;
  @Column({ name: 'external_debit_id' })
  accountExternalIdCredit: string;
  @Column({ name: 'transfer_type' })
  tranferTypeId: number;
  @Column({ name: 'value' })
  value: number;
  @Column({ default: 'pending' })
  status?: string;
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt?: Date;
}
