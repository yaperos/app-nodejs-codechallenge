import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionStatus } from '../transaction/transaction-status';

@Entity()
export class Transaction {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    length: 30,
    type: 'varchar',
  })
  accountExternalIdDebit: string;

  @Column({
    nullable: false,
    length: 30,
    type: 'varchar',
  })
  accountExternalIdCredit: string;

  @Column('int')
  transferTypeId: number;

  @Column('float')
  value: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;
}
