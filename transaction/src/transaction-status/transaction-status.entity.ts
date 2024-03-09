import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}