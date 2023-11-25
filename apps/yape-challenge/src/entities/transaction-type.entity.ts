import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TransaccionEntity } from './transaction.entity';

@Entity()
export class TransactionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  typeName: string;

  @OneToMany(
    () => TransaccionEntity,
    (transaction) => transaction.tranferTypeId,
  )
  transactions: TransaccionEntity[];
}
