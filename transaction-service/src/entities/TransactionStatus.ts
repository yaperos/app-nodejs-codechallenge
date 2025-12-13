import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './Transaction';

// Catálogo de estados de transacción
@Entity('transaction_statuses')
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Transaction, transaction => transaction.transactionStatus)
  transactions!: Transaction[];
}
