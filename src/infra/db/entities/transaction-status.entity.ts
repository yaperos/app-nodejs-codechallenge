import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { StatusType } from '../../../domain/_shared/constants/transactions-status.enum';

@Entity({
  name: 'transaction_status',
})
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'enum', enum: StatusType, default: StatusType.PENDING, name: 'status' })
  public status!: StatusType;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
