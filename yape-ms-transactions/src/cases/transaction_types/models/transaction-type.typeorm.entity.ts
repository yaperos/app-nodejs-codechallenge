import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/* Project */
import { TransactionType } from './transaction-type.model';

@Entity({ name: 'transaction_types' })
export class TransactionTypeEntity implements TransactionType {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column('text', { name: 'name' })
  name: string;
}
