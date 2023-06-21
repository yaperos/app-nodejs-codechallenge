import {
  Index,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Transaction } from './Transaction.entity';
import { TABLES } from '../../commons/database/constants';

const { TRANSACTION_STATUS } = TABLES;

@Index(`IDX_${TRANSACTION_STATUS}_id`, ['id'])
@Entity(TRANSACTION_STATUS)
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.transactionStatus)
  transactions: Transaction[];
}
