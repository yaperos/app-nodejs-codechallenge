import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAccount } from './userAccount';
import { TransferType } from './transferType';
import { TransactionStatus } from 'src/common/transaction.type';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Column({ type: 'uuid', nullable: false })
  accountExternalIdDebit: string;

  @ManyToOne(() => UserAccount, (userAccount) => userAccount)
  @JoinColumn({ name: 'accountExternalIdDebit' })
  accountExternalDebit: UserAccount;

  @Column({ type: 'uuid', nullable: false })
  accountExternalIdCredit: string;

  @ManyToOne(() => UserAccount, (userAccount) => userAccount)
  @JoinColumn({ name: 'accountExternalIdCredit' })
  accountExternalCredit: UserAccount;

  @Column({ type: 'bigint', nullable: false })
  transferTypeId: number;

  @ManyToOne(() => TransferType, (transferType) => transferType)
  @JoinColumn({ name: 'transferTypeId' })
  transferType: TransferType;

  @Column({ type: 'float', nullable: false })
  value: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.pending,
  })
  status: TransactionStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  constructor(
    payload: Omit<
      Transaction,
      | 'updatedAt'
      | 'createdAt'
      | 'status'
      | 'accountExternalDebit'
      | 'accountExternalCredit'
    >,
  ) {
    if (payload) {
      this.accountExternalIdCredit = payload.accountExternalIdCredit;
      this.accountExternalIdDebit = payload.accountExternalIdDebit;
      this.transferTypeId = payload.transferTypeId;
      this.value = payload.value;
      this.transferType = payload.transferType;
    }
  }
}
