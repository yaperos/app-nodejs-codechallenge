import { Table, Column, Model, DataType } from "sequelize-typescript";

import { TransactionTypeAttributes } from "../interfaces/transactionType.interface";

@Table( { tableName: "transaction_type", timestamps: false } )

class TransactionTypeModel extends Model<TransactionTypeAttributes> {

  @Column( {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  } )
    id!: number;

  @Column( {
    type: DataType.STRING( 10 ),
    allowNull: false,
    unique: true,
  } )
    name!: string;
}

export async function initTransactionTypeDatabase() {
  try {
    await TransactionTypeModel.sync({ force: true });

    const statuses = ['Other'];
    
    for (const status of statuses) {
      await TransactionTypeModel.create({ name: status });
    }
  } catch (error) {
     const err = error as Error
     throw new Error( err.message )
  }

}


export default TransactionTypeModel;