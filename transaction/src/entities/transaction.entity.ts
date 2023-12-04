import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionType } from './transaction-type.entity';
import { TransactionStatus } from './transaction-status.entity';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @Column()
  tranferTypeId: number;

  @Column()
  value: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => TransactionType,
    (transactionType) => transactionType.transactions,
  )
  transactionType: TransactionType;

  @ManyToOne(
    () => TransactionStatus,
    (transactionStatus) => transactionStatus.transactions,
  )
  transactionStatus: TransactionStatus;
}
