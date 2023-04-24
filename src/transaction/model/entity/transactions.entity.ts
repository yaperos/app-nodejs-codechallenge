import { DateTime } from 'luxon';
import { Column, Entity, Generated, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity({ name: 'transactions' })
export class Transactions {
  @PrimaryGeneratedColumn("uuid")
  @Generated('uuid')
  transactionId: string;

  @Column({name:"accountExternalIdDebit"})
  accountExternalIdDebit: string;

  @Column({name:"accountExternalIdCredit"})
  accountExternalIdCredit: string;

  @Column({name:"transferTypeId"})
  transferTypeId: number;

  @Column({name:"transactionStatus"})
  transactionStatus: number;

  @Column({name:"valueTransaction"})
  valueTransaction: number;

  @Column({name:"createdAt"})
  createdAt: Date;
}