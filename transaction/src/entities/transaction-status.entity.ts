import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('transaction_status')
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.transactionStatus)
  transactions: Transaction[];
}
