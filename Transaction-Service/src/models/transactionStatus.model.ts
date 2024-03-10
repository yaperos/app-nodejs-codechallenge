import { Table, Column, Model, DataType } from "sequelize-typescript";

import { TransactionStatusAttributes } from "../interfaces/transactionStatus.interface";

@Table( { tableName: "transaction_status", timestamps: false } )

class TransactionStatusModel extends Model<TransactionStatusAttributes> {

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

  export async function initTransactionStatusDatabase() {
    try {
      await TransactionStatusModel.sync({ force: true });
  
      const statuses = ['Pending', 'Approved', 'Rejected'];
    
      for (const status of statuses) {
        await TransactionStatusModel.create({ name: status });
      }
    } catch (error) {
       const err = error as Error
       throw new Error( err.message )
    }

  }
  

export default TransactionStatusModel;