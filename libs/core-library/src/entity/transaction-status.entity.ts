import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from './audit.entity';

@Entity({ name: 'transaction_status' })
export class TransactionStatus extends Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
