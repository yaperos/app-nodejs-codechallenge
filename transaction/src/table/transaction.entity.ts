import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { status } from '../enums/status.enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid', {
    name: 'transactionExternalId',
  })
  transactionExternalId: string;

  @Column({
    name: 'accountExternalIdDebit',
  })
  accountExternalIdDebit: string;

  @Column({
    name: 'tranferTypeId',
  })
  tranferTypeId: number;

  @Column({
    name: 'accountExternalIdCredit',
  })
  accountExternalIdCredit: string;

  @Column({
    name: 'value',
    type: 'int',
  })
  value: number;

  @Column({
    name: 'transactionStatus',
    default: status.PENDING,
  })
  transactionStatus: number;

  @Column({
    name: 'createdAt',
    type: 'timestamp',
    default: new Date(),
  })
  createdAt: Date;
}
