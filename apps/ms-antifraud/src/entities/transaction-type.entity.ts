import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transaction_types'})
export class TransactionType {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

}
