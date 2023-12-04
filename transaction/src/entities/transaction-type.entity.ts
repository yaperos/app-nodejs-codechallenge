import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('transaction_type')
export class TransactionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.transactionType)
  transactions: Transaction[];
}
