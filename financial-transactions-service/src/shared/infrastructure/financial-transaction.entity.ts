import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity({
  name: 'financial_transactions',
})
export class FinancialTransactionEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  externalId: string;

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @Column()
  value: number;

  @Column()
  transferTypeId: string;

  @Column()
  transferStatusId: string;

  @Column()
  createdAt: Date;
}
