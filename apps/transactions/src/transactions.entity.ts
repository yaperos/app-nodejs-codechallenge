import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @Column({ nullable: false })
  status: string;
}
