import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './Transaction';

// Catálogo de tipos de transacción
@Entity('transaction_types')
export class TransactionType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Transaction, transaction => transaction.transactionType)
  transactions!: Transaction[];
}
