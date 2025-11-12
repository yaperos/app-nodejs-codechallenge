import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transaction_status')
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;
}
