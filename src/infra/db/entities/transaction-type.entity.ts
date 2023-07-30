import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Type } from '../../../domain/_shared/constants/transaction-type.enum';

@Entity({
  name: 'transaction_type',
})
export class TransactionType {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'enum', enum: Type, default: Type.TRANSFER, name: 'type' })
  public type!: Type;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
