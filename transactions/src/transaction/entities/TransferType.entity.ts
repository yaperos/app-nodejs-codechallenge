import {
  Index,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Transaction } from './Transaction.entity';
import { TABLES } from '../../commons/database/constants';
import { TransferType as TransferTypeEnum } from '../graphql/types';

const { TRANSFER_TYPE } = TABLES;

@Index(`IDX_${TRANSFER_TYPE}_id`, ['id'])
@Entity(TRANSFER_TYPE)
export class TransferType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  name: TransferTypeEnum;

  @OneToMany(() => Transaction, (transaction) => transaction.transferType)
  transactions: Transaction[];
}
