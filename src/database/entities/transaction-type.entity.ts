import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transaction_types')
export class TransactionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;
}
