import {
  Column,
  Entity,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TransactionType {
  REGULAR = 'regular',
}

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  transactionExternalId!: string;

  @Column()
  accountExternalIdDebit!: string;

  @Column()
  accountExternalIdCredit: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.REGULAR,
  })
  transactionType: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  transactionStatus: TransactionStatus;

  @Column()
  value: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updtedAt: Date;

  toJSON() {
    return {
      transactionExternalId: this.transactionExternalId,
      transactionType: {
        name: this.transactionType,
      },
      transactionStatus: {
        name: this.transactionStatus,
      },
      value: this.value,
      createdAt: this.createdAt,
    };
  }
}
