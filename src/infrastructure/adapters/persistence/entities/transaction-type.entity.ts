import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transaction_types')
export class TransactionTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;
} 