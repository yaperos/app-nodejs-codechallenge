import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('TransactionStatus')
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  statusId: number;

  @Column({ unique: true })
  name: string;
}
