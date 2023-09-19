import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'transaction' })
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionExternalId: string;

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;  

  @Column()
  tranferTypeId: number;

  @Column()
  value: number;  

  @Column()
  transactionType: string;  

  @Column()  
  transactionStatus: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;
}