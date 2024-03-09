import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransactionStatus {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('varchar', { nullable: false, unique: true })
  name: string;
}
