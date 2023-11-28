import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  Entity,
} from 'typeorm';

@Entity({ name: 'transaction' })
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'transaction_external_id' })
  transactionExternalId: string;

  @Column({ name: 'transaction_status' })
  transactionStatus: string;

  @Column({ name: 'value' })
  value: number;

  @Column({ name: 'tranferTypeId' })
  tranferTypeId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
