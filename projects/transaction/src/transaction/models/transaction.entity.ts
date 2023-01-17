import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryColumn()
  id: string;
  @Column()
  status: number;
  @Column()
  type: number;
  @Column()
  value: number;
  @Column()
  createdAt: Date;
}
