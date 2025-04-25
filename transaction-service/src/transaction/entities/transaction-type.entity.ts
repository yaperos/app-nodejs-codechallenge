import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('transactions-type')
export class TransactionType {
  @PrimaryGeneratedColumn()
  transactionTypeId: number;

  @Column()
  transactionTypeName: string;

  @OneToMany(() => Transaction, (transaction) => transaction.transactionType)
  transactions: Transaction[];
}
