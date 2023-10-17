import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from './audit.entity';

@Entity({ name: 'transaction_type' })
export class TransactionType extends Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
