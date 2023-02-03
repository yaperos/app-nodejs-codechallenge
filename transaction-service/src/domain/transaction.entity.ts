import { Column, Entity } from 'typeorm';

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

  @Column('int', { default: 1 })
  transactionStatusId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
