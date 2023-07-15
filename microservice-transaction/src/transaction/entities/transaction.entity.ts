import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TransactionStatus } from '../structure/enums/transaction.status';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'account_external_id_debit',
    type: 'varchar',
    nullable: true,
  })
  accountExternalIdDebit: string;

  @Column({
    name: 'account_external_id_credit',
    type: 'varchar',
    nullable: true,
  })
  accountExternalIdCredit: string;

  @Column({
    name: 'transfer_type_id',
  })
  transferTypeId: number;

  @Column()
  value: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    name: 'transation_status',
    default: TransactionStatus.PENDING,
  })
  transactionStatus: number;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
