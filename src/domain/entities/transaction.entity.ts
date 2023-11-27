import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus } from './transaction-status.entity';
import { TransactionType } from './transaction-type.entity';

import * as dayjs from 'dayjs';
import { dayjsTransformer } from 'src/common/utils/column-entity-transformer.utils';

@Entity()
export class Transaction {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'uuid' })
  accountDebitId: string;

  @Column({ type: 'uuid' })
  accountCreditId: string;

  @ManyToOne(
    () => TransactionType,
    (transactionType) => transactionType.transactions,
    { nullable: false },
  )
  type: TransactionType;

  @Column({ type: 'numeric' })
  amount: number;

  @ManyToOne(
    () => TransactionStatus,
    (transactionStatus) => transactionStatus.transactions,
    { nullable: false },
  )
  status: TransactionStatus;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: dayjsTransformer,
  })
  createdAt: dayjs.Dayjs;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: dayjsTransformer,
  })
  updatedAt: dayjs.Dayjs;
}
