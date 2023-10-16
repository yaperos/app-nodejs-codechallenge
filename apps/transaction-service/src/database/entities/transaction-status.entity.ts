import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity({ name: 'transaction_status' })
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.transactionStatus)
  transaction?: Transaction[];
}
