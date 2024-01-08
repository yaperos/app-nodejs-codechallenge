import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus } from '../constants/transaction-status.enum';
import { TransactionTypeEntity } from 'src/modules/transactions-types/entities/transactions-type.entity';

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'transaction_eternal_id', type: 'uuid' })
  transactionExternalId: string;

  @Column({ name: 'account_external_id_debit' })
  accountExternalIdDebit: string;

  @Column({ name: 'account_external_id_credit' })
  accountExternalIdCredit: string;

  @ManyToOne(() => TransactionTypeEntity)
  transactionType: TransactionTypeEntity;

  @Column('float')
  value: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
