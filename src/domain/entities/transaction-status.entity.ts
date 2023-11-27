import { Dayjs } from 'dayjs';
import { dayjsTransformer } from 'src/common/utils/column-entity-transformer.utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class TransactionStatus {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Index({ unique: true })
  @Column()
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.status)
  transactions: Transaction[];

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: dayjsTransformer,
  })
  createdAt: Dayjs;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: dayjsTransformer,
  })
  updatedAt: Dayjs;
}
