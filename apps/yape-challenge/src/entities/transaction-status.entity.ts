import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TransaccionEntity } from './transaction.entity';

@Entity()
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  statusName: string;

  @OneToMany(
    () => TransaccionEntity,
    (transaction) => transaction.transactionStatus,
  )
  transactions: TransaccionEntity[];
}
