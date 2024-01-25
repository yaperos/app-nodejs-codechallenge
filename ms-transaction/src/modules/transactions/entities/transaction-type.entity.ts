import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class TransferType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.transferType)
  transactions: Transaction[];
}
