import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity({ name: 'transaction_type' })
export class TransactionType {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.transactionType)
  transaction?: Transaction[];
}
