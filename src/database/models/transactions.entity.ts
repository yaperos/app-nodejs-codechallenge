import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity({
  name: 'transactions',
})
export class TransactionsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true, nullable: false })
  transaction_external_id: string;

  @Column({ nullable: false })
  transaction_type_id: number;

  @Column({ nullable: false })
  transaction_type_name: string;

  @Column({ nullable: false })
  transaction_status: string;

  @Column({ nullable: false })
  value: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date | string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date | string;
}
