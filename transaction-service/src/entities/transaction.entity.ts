import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransferType } from './transferType.entity';
import { TransactionStatus } from './transactionStatus.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @ManyToOne(() => TransferType)
  @JoinColumn({ name: 'transferTypeId' })
  transferType: TransferType;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @ManyToOne(() => TransactionStatus)
  @JoinColumn({ name: 'statusId' })
  transactionStatus: TransactionStatus;

  @CreateDateColumn()
  createdAt: Date;
}
