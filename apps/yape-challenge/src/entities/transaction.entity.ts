import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionStatus } from './transaction-status.entity';
import { TransactionType } from './transaction-type.entity';

@Entity()
export class TransaccionEntity {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @ManyToOne(
    () => TransactionType,
    (transactionType) => transactionType.transactions,
  )
  @JoinColumn({ name: 'type_id' })
  tranferTypeId: TransactionType;

  @Column('int')
  value: number;

  @ManyToOne(
    () => TransactionStatus,
    (transactionStatus) => transactionStatus.transactions,
  )
  @JoinColumn({ name: 'status_id' })
  transactionStatus: TransactionStatus;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
