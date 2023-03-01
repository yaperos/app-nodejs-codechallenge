import { TransactionStatusEnum } from 'src/shared/enums/transaction-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'numeric' })
  value: number;

  @Column({ type: 'numeric' })
  transactionType: number;

  @Column({
    type: 'enum',
    enum: TransactionStatusEnum,
    default: TransactionStatusEnum.PENDING,
  })
  transactionStatus: TransactionStatusEnum;

  @Column({ type: 'uuid' })
  accountExternalIdDebit: string;

  @Column({ type: 'uuid' })
  accountExternalIdCredit: string;
}
