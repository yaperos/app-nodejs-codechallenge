import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionType } from './transaction-type.entity';
import { TransactionStatus } from './transaction-status.entity';

@Entity({ name: 'transactions' }) 
export class Transaction {

  @PrimaryGeneratedColumn('uuid') 
  transactionExternalId: string;

  @Column()
  accountExternalIdDebit: string;

  @Column() 
  accountExternalIdCredit: string;

  @Column()
  transferTypeId: number;

  @Column()
  value: number;

  @Column() 
  createdAt: Date = new Date();

  @Column()
  updatedAt: Date;

  @ManyToOne(type => TransactionType)  
  transactionType: TransactionType;

  @ManyToOne(type => TransactionStatus)
  transactionStatus: TransactionStatus;

}