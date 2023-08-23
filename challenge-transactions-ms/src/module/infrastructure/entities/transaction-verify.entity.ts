import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionVerifyTypeEntity } from './transaction-verify-type.entity';
import { TransactionVerifyStatusEntity } from './transaction-verify-status.entity';

@Entity({ name: 'transactionsVerify' })
export class TransactionVerifyEntity {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Column('uuid')
  accountExternalIdDebit: string;

  @Column('uuid')
  accountExternalIdCredit: string;

  @ManyToOne(() => TransactionVerifyTypeEntity, { eager: true, cascade: true })
  transactionType: TransactionVerifyTypeEntity;

  @ManyToOne(() => TransactionVerifyStatusEntity, {
    eager: true,
    cascade: true,
  })
  transactionStatus: TransactionVerifyStatusEntity;

  @Column()
  value: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAtStatus: Date;
}
