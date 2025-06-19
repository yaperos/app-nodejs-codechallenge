import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transaction_statuses')
export class TransactionStatusOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;
} 