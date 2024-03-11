import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";

import { TransactionAttributes } from "../interfaces/transaction.interface";
import {TransactionTypeModel, TransactionStatusModel } from "./";

@Table( { tableName: "transaction", timestamps: false } )

class TransactionModel extends Model<TransactionAttributes> {

  @Column( {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  } )
    id!: number;

  @Column( {
    type: DataType.STRING( 16 ),
  } )
    transactionExternalId!: string;

  @Column( {
    type: DataType.STRING( 16 ),
    allowNull: false
  } )
    accountExternalIdDebit!: string;

  @Column( {
    type: DataType.STRING( 16 ),
    allowNull: false
  } )
    accountExternalIdCredit!: string;

  @ForeignKey( () => TransactionTypeModel )
  @Column( {
    type: DataType.INTEGER,
    defaultValue: 1
  } )
    tranferTypeId!: number;
  @BelongsTo( () => TransactionTypeModel, "tranferTypeId" )
    transaction_type?: TransactionTypeModel;

  @ForeignKey( () => TransactionStatusModel )
  @Column( {
    type: DataType.INTEGER,
    defaultValue: 1
  } )
    tranferStatusId!: number;
  @BelongsTo( () => TransactionStatusModel, "tranferStatusId" )
    transaction_status?: TransactionStatusModel;

  @Column( {
    type: DataType.INTEGER,
    allowNull: false
  } )
    value!: number;

  @Column({
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW,
      field: "created_at",
    })
    createdAt!: Date;
}

export async function initTransactionDatabase() {
  try {
    await TransactionModel.sync({ force: true });
  } catch (error) {
     const err = error as Error
     throw new Error( err.message )
  }

}

export default TransactionModel;