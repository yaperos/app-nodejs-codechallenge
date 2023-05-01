import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { TransactionStatus } from 'src/transaction-status/entities/transaction-status.entity';
import { TransactionType } from 'src/transaction-type/entities/transaction-type.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
@Entity()
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  transactionExternalId: string;

  @Column()
  @Field()
  accountExternalIdDebit: string;

  @Column()
  @Field()
  accountExternalIdCredit: string;

  @Column({ type: 'integer' })
  @Field(() => Int)
  value: number;

  @Column({ type: 'integer' })
  @Field(() => Int)
  transactionTypeId: number;

  @ManyToOne(
    () => TransactionType,
    (transactionType) => transactionType.transaction,
  )
  @Field(() => TransactionType)
  transactionType: TransactionType;

  @Column({ type: 'integer' })
  @Field(() => Int)
  transactionStatusId: number;

  @ManyToOne(
    () => TransactionStatus,
    (transactionStatus) => transactionStatus.transaction,
  )
  @Field(() => TransactionStatus)
  transactionStatus: TransactionStatus;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
}
