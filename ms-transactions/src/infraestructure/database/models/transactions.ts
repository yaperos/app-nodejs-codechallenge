import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionType } from './transactionType';
import { TransactionStatus } from './transactionStatus';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TransactionType, (transactionType) => transactionType.id)
  type: number;

  @ManyToOne(
    () => TransactionStatus,
    (transactionStatus) => transactionStatus.id,
  )
  status: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  value: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('uuid', { nullable: false, unique: true })
  transactionExternalId: string;
}
