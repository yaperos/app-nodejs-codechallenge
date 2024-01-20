import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TRANSACTION_STATUS } from '../constants/transactions.constants';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @Column({ type: 'uuid' })
  accountExternalIdDebit: string;

  @Column({ type: 'uuid' })
  accountExternalIdCredit: string;

  @Column()
  transferTypeId: number;

  @Column()
  value: number;

  @Column({
    type: 'enum',
    enum: TRANSACTION_STATUS,
    default: TRANSACTION_STATUS.PENDING,
  })
  status: TRANSACTION_STATUS;
}
