import { TransactionStatus } from 'src/shared/domain/transaction.model';
import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transaction')
@Index('IDX_transaction_transactionId', ['transactionId'])
@Index('IDX_transaction_transactionTypeId', ['transactionTypeId'])
@Index('IDX_transaction_accountExternalIdDebit', ['accountExternalIdDebit'])
@Index('IDX_transaction_accountExternalIdCredit', ['accountExternalIdCredit'])
export class TransactionPostgres {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', nullable: false })
  transactionId: string;

  @Column({ type: 'varchar', nullable: true })
  accountExternalIdDebit?: string;

  @Column({ type: 'varchar', nullable: true })
  accountExternalIdCredit?: string;

  @Column({ type: 'integer', nullable: true })
  transactionTypeId?: number;

  @Column('numeric', { precision: 10, scale: 2, nullable: true })
  value?: number;

  @Column({ type: 'varchar', nullable: true })
  status?: TransactionStatus;

  @Column({ name: 'created_at', nullable: false })
  createdAt: Date;
}
