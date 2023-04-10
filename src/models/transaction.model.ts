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
import { ITransaction } from '../types/transaction.type';

interface CreationAttributes extends Optional<ITransaction, 'id'> {}

@Table({
  tableName: 'transactions',
  timestamps: true,
  deletedAt: true,
})
export class Transaction
  extends Model<ITransaction, CreationAttributes>
  implements ITransaction
{
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT })
  declare id: number;

  @Column({ type: DataType.BIGINT })
  declare tranferTypeId: number;

  @Column({ type: DataType.BIGINT })
  declare status_id: number;

  @Column({ type: DataType.DECIMAL(8, 2) })
  declare value: number;

  @Column({ type: DataType.STRING(200) })
  declare accountExternalIdCredit: string;

  @Column({ type: DataType.STRING(200) })
  declare accountExternalIdDebit: string;

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;

  @DeletedAt
  deleted_at?: Date;
}
