import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransactionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}