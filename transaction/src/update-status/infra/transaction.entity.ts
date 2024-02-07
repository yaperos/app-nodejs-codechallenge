import { TransactionStatus } from 'src/shared/domain/transaction.model';
import { Entity, Column, Index } from 'typeorm';

@Entity('transaction')
@Index('IDX_transaction_transactionTypeId', ['transactionTypeId'])
@Index('IDX_transaction_accountExternalIdDebit', ['accountExternalIdDebit'])
@Index('IDX_transaction_accountExternalIdCredit', ['accountExternalIdCredit'])
export class TransactionPostgres {
  @Column({ primary: true, type: 'uuid' })
  id: string;

  @Column({ type: 'varchar' })
  accountExternalIdDebit: string;

  @Column({ type: 'varchar' })
  accountExternalIdCredit: string;

  @Column({ type: 'integer' })
  transactionTypeId: number;

  @Column({ type: 'integer' })
  value: number;

  @Column({ type: 'varchar' })
  status: TransactionStatus;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
