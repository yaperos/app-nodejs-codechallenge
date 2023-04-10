import {
  Table,
  Model,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { ITransactionType } from '../types/transaction_type.type';

interface CreationAttributes extends Optional<ITransactionType, 'id'> {}

@Table({
  tableName: 'transaction_types',
  timestamps: true,
  deletedAt: true,
})
export class TransactionType
  extends Model<ITransactionType, CreationAttributes>
  implements ITransactionType
{
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT })
  declare id: number;

  @Column({ type: DataType.STRING(200) })
  declare name: string;

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;

  @DeletedAt
  deleted_at?: Date;
}
