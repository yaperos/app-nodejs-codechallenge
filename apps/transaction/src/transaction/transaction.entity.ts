import {TransactionStatus} from './transaction.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {AutoMap} from '@automapper/classes';

@Entity()
export class Transaction {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @AutoMap()
  @Column('uuid')
  accountExternalIdDebit: string;

  @AutoMap()
  @Column('uuid')
  accountExternalIdCredit: string;

  @AutoMap()
  @Column('int')
  tranferTypeId: number;

  @AutoMap()
  @Column('float')
  value: number;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @AutoMap()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
