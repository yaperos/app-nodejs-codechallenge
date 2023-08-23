import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'transactionVerifyType' })
export class TransactionVerifyTypeEntity {
  @PrimaryColumn()
  id?: number;

  @Column()
  name: string;
}
