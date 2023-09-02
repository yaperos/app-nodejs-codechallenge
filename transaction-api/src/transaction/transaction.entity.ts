import { Field, ObjectType } from '@nestjs/graphql';
import { TransactionStatus } from 'src/common/commonTypes';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
// Transaction entity for database
export class Transaction {
  // Primary key for transaction
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  // Debir account external id
  @Column({ type: 'uuid' })
  @Field()
  accountExternalIdDebit?: string;

  // Credit account external id
  @Column({ type: 'uuid' })
  @Field()
  accountExternalIdCredit: string;

  // Transfer type
  @Column()
  @Field()
  transferType: number;

  // Transaction value
  @Column()
  @Field()
  value: number;

  // Transaction status
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  @Field()
  status: TransactionStatus;

  // Created at
  @CreateDateColumn()
  @Field()
  createdAt: Date;

  // Updated at
  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  // Deleted at
  @DeleteDateColumn()
  @Field()
  deletedAt?: Date;
}
