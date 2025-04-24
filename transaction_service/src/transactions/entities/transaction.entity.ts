import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column({ type: 'uuid', unique: true, default: () => `'${uuidv4()}'` })
  @Index()
  transactionExternalId: string;

  @Column('uuid')
  @Index()
  accountExternalIdDebit: string;

  @Column('uuid')
  @Index()
  accountExternalIdCredit: string;

  @Column()
  transferTypeId: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  value: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  @Index()
  status: TransactionStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}