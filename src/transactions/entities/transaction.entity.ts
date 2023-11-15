import { TransactionStatus } from 'src/common/types/transactionStatus';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class TransactionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  accountExternalIdDebit: string;

  @Column({ type: 'uuid' })
  accountExternalIdCredit: string;

  @Column()
  tranferTypeId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
