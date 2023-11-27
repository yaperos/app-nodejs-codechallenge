import * as dayjs from 'dayjs';
import { dayjsTransformer } from 'src/common/utils/column-entity-transformer.utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class TransactionType {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.type)
  transactions: Transaction[];

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
