import {
  BalanceTransaction,
  TransactionType,
} from 'src/balance/domain/entity/balance-transaction';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'balance_transaction' })
export class PostgreBalanceTransaction implements BalanceTransaction {
  @PrimaryGeneratedColumn('uuid')
  public balanceTransactionId: string;

  @Column({ type: 'uuid' })
  public accountBalanceId: string;

  @Column({ type: 'character varying' })
  public transactionType: TransactionType;

  @Column({ type: 'character varying' })
  public description: string;

  @Column({ type: 'double precision', default: 0 })
  public amount: number;

  @CreateDateColumn()
  public createdAt: Date;
}
