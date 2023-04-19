import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';


@Entity('transaction_status')
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.transactionStatus)
  transactions: Transaction[];
}
