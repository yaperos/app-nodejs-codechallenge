import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transactionType' })
export class FinancialTransactionType {
  @PrimaryGeneratedColumn()
  transactionTypeId: number;

  @Column()
  transactionType: string;
}
