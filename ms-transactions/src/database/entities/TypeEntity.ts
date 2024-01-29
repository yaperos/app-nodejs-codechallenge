import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { TransactionEntity } from './TransactionEntity';

@Table({
  tableName: 'types',
  modelName: 'Type',
  timestamps: false
})
export class TypeEntity extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  declare id: number;

  @Column({
    type: DataType.STRING
  })
  declare name: string;

  @HasMany(() => TransactionEntity)
  declare transactions: TransactionEntity[];
}
