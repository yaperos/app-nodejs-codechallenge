import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from './audit.entity';

@Entity({ name: 'transfer_type' })
export class TransferType extends Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
