import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'transactionVerifyStatus' })
export class TransactionVerifyStatusEntity {
  @PrimaryColumn()
  id?: number;

  @Column()
  name: string;
}
