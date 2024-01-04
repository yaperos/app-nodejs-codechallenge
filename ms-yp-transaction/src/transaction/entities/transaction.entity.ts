import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionStatusEnum } from '../enums/transaction.status.enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  accountExternalIdDebit: string;

  @Column('text')
  accountExternalIdCredit: string;

  @Column('int')
  tranferTypeId: number;

  @Column('numeric')
  value: number;

  @Column({
    type: 'enum',
    enum: TransactionStatusEnum,
    default: TransactionStatusEnum.PENDING,
  })
  transactionStatus: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
