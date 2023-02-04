import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TransactionStatus } from './transaction-status.entity';
import { TransferType } from './transaction-type.entity';

@Entity('transaction')
export class Transaction {
  @Column({ primary: true, generated: 'uuid' })
  transactionExternalId: string;

  @Column({ length: 36 })
  accountExternalIdDebit: string;

  @Column({ length: 36 })
  accountExternalIdCredit: string;

  @Column('int', { nullable: true })
  tranferTypeId: number;

  @ManyToOne(
    () => TransferType,
    (transactionType) => transactionType.transferTypeId,
    { nullable: true },
  )
  @JoinColumn({ name: 'tranfer_type_id' })
  tranferType: number;

  @Column('int', { default: 1 })
  transactionStatusId: number;

  @ManyToOne(
    () => TransactionStatus,
    (transactionStatus) => transactionStatus.transactionStatusId,
    { nullable: true },
  )
  @JoinColumn({ name: 'transaction_status_id' })
  transactionStatus: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
