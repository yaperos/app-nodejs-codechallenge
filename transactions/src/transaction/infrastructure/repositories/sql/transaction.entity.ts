import { StatusesEnum } from 'src/transaction/domain/enum/transaction.statuses';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  accountExternalIdDebit: string;

  @Column({ type: 'varchar', length: 100 })
  accountExternalIdCredit: string;

  @Column({ type: 'numeric' })
  tranferTypeId: number;

  @Column({ type: 'numeric' })
  value: number;

  @Column({ type: 'enum', enum: StatusesEnum, default: StatusesEnum.PENDING })
  status: StatusesEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
