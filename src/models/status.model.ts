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
import { IStatus } from '../types/status.type';

interface CreationAttributes extends Optional<IStatus, 'id'> {}

@Table({
  tableName: 'status',
  timestamps: true,
  deletedAt: true,
})
export class Status
  extends Model<IStatus, CreationAttributes>
  implements IStatus
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
