import {
  Index,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TransferType } from './TransferType.entity';
import { TABLES } from '../../commons/database/constants';
import { TransactionStatus } from './TransactionStatus.entity';

const { TRANSACTION } = TABLES;

@Entity(TRANSACTION)
@Index(`IDX_${TRANSACTION}_id`, ['id'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_external_id_debit', type: 'uuid' })
  accountExternalIdDebit: string;

  @Column({ name: 'account_external_id_credit', type: 'uuid' })
  accountExternalIdCredit: string;

  @Column({ name: 'transfer_type_id', type: 'int' })
  transferTypeId: number;

  @ManyToOne(() => TransferType, (transferType) => transferType.transactions)
  @JoinColumn({ name: 'transfer_type_id' })
  transferType: TransferType;

  @Column({ name: 'transaction_status_id', type: 'int' })
  transactionStatusId: number;

  @ManyToOne(
    () => TransactionStatus,
    (transactionStatus) => transactionStatus.transactions,
  )
  @JoinColumn({ name: 'transaction_status_id' })
  transactionStatus: TransactionStatus;

  @Column({ type: 'int' })
  value: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
