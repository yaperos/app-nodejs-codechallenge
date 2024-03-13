import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransactionType {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('varchar', { nullable: false, unique: true })
  name: string;
}
