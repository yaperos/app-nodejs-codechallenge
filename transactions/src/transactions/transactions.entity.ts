import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  transactionType: string;
  @Column()
  transactionStatus: string;
  @Column()
  transactionExternalId: string;
  @Column()
  value: number;
  @Column()
  createdAt: Date;
}
