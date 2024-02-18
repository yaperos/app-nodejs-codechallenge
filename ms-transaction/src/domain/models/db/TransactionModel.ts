import { Table, Column, Model, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey, DataType, HasOne } from 'sequelize-typescript';
import {TransactionType} from './TransactionType'
import { TransactionStatus } from './TransactionStatus'

@Table
export default class Transaction extends Model {

  @Column(DataType.STRING)
  accountExternalIdDebit: string;
  @Column(DataType.STRING)
  accountExternalIdCredit: string;
  @Column(DataType.SMALLINT)
  tranferTypeId: number;
  @Column(DataType.SMALLINT)
  value: number;
  @Column(DataType.STRING)
  transactionExternalId:string;
  @Column(DataType.DATE)
  @CreatedAt
  createdAt:Date;
  @Column(DataType.DATE)
  @UpdatedAt
  updatedAt:Date;

  @ForeignKey(() => TransactionType)
  @Column(DataType.BIGINT)
  transactionTypeID: number;
  @ForeignKey(() => TransactionStatus)
  @Column(DataType.BIGINT)
  transactionStatusID: number;

  @BelongsTo(()=> TransactionType)
  transactionType:TransactionType
  @BelongsTo(()=> TransactionStatus)
  transactionStatus:TransactionStatus

}