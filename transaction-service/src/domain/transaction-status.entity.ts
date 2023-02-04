import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('transaction-status')
export class TransactionStatus {
  @PrimaryColumn()
  transactionStatusId: number;

  @Column()
  name: string;

}
