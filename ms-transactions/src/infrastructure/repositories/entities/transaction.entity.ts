import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import {
  TransactionType,
  TransactionStatus,
} from '../../../domain/enums/transaction.enums';
import { DecimalTypeORMTransformer } from 'src/utils/decimal';
import Decimal from 'decimal.js';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Column('uuid')
  accountExternalIdDebit: string;

  @Column('uuid')
  accountExternalIdCredit: string;

  @Column('int')
  tranferTypeId: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.TRANSFER,
  })
  transactionType: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  transactionStatus: TransactionStatus;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new DecimalTypeORMTransformer(),
  })
  value: Decimal;

  @CreateDateColumn()
  createdAt: Date;
}
