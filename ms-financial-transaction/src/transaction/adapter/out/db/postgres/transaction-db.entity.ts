import { TransactionStatus } from '../../../../../transaction/entity/transaction-status.enum';
import { TransactionType } from '../../../../../transaction/entity/transaction-type.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class TransactionDbEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('varchar', { length: 20 })
  type: TransactionType;

  @Column('varchar', { length: 36 })
  accountExternalIdDebit: string;

  @Column('varchar', { length: 36 })
  accountExternalIdCredit: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    enumName: 'transaction_status_enum',
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;
}
