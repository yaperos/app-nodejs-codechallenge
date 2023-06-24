import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  externalId: string;

  @Column()
  accountExternalId: string;

  @Column()
  transactionType: string;

  @Column()
  tranferTypeId: number;

  @Column()
  value: number;

  @Column()
  status: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
