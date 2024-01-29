import { StatusEntity } from './StatusEntity';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { TypeEntity } from './TypeEntity';

@Table({
  timestamps: true,
  tableName: 'transactions',
  modelName: 'Transaction'
})
export class TransactionEntity extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4
  })
  declare transactionExternalId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  declare accountExternalIdDebit: string;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  declare accountExternalIdCredit: string;

  @ForeignKey(() => TypeEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare typeId: number;

  @BelongsTo(() => TypeEntity)
  declare transactionType: TypeEntity;

  @ForeignKey(() => StatusEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare statusId: number;

  @BelongsTo(() => StatusEntity)
  declare transactionStatus: StatusEntity;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false
  })
  declare value: number;
  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
