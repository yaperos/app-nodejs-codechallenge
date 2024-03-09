import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { TransactionStatus } from '../transaction-status/transaction-status.entity';
import { TransactionType } from 'src/transaction-type/transaction-type/transaction-type.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @ManyToOne(() => TransactionType)
  @JoinColumn()
  tranferType: TransactionType;

  @Column()
  value: number;

  @ManyToOne(() => TransactionStatus)
  @JoinColumn()
  status: TransactionStatus;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}