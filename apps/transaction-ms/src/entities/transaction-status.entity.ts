import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ length: 200 })
  name: string;
}
