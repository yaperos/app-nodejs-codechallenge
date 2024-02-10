import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transaction_statuses'}) 
export class TransactionStatus {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

}
