import { TRANSACTION_STATUS } from '@app/common/interfaces';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Column('uuid')
  accountExternalIdDebit: string;

  @Column('uuid')
  accountExternalIdCredit: string;

  @Column('int')
  tranferTypeId: number;

  @Column('float')
  value: number;

  @Column({ default: 'pending', length: 15, type: 'varchar' })
  status: TRANSACTION_STATUS;

  @CreateDateColumn()
  createdAt: Date;
}
