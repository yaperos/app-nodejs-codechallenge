import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Column({ length: 255 })
  accountExternalIdDebit: string;

  @Column({ length: 255 })
  accountExternalIdCredit: string;

  @Column({ name: 'transaction_type_id' })
  transactionTypeId: number;

  @ManyToOne(() => TransactionType, (transactionType) => transactionType.name, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn({ name: 'transaction_type_id' })
  transactionType: Relation<TransactionType>;

  @Column({ name: 'transaction_status_id' })
  transactionStatusId: number;

  @ManyToOne(
    () => TransactionStatus,
    (transactionStatus) => transactionStatus.name,
    { cascade: true, nullable: false },
  )
  @JoinColumn({ name: 'transaction_status_id' })
  transactionStatus: Relation<TransactionStatus>;

  @Column()
  value: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity()
export class TransactionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 48, default: 'yape', unique: true })
  name: string;
}

@Entity()
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 48, unique: true })
  name: string;
}
