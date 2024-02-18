import { Table,Column,Model, DataType, HasOne } from 'sequelize-typescript'
import TransactionModel from './TransactionModel'

@Table
export class TransactionStatus extends Model{
    
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      })
    id: number;

    @Column(DataType.STRING)
    name: string;

    @HasOne(()=>TransactionModel)
    transaction:TransactionModel
}