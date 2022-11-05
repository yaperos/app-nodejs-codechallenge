import { TranferType } from 'src/tranfer-type/entities/tranfer-type.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  Entity,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'transaction_external_id' })
  transactionExternalId: string;

  @OneToOne(() => TranferType, (transactionType) => transactionType.id, {
    nullable: true,
  })
  transactionType: TranferType;

  @Column({ name: 'transaction_status' })
  transactionStatus: string;

  @Column({ name: 'value' })
  value: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
