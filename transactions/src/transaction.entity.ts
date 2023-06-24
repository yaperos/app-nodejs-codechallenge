import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionStatus } from './enum/transaction-status';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;
  @Column()
  transferTypeId: number;
  @Column()
  value: number;
  @Column({ nullable: true })
  accountExternalIdDebit?: string;
  @Column({ nullable: true })
  accountExternalIdCredit?: string;
  @Column()
  status: TransactionStatus;
  @Column()
  createdAt: Date;
}
