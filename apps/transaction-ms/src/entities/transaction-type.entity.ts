import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TransactionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;
}
