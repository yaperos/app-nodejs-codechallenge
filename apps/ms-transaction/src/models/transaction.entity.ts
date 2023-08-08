import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus } from './transactionStatus.entity';
import { TransactionType } from './transactionType.entity';

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  @Field((type) => Int)
  id: number;

  @Field()
  @Column({ nullable: false })
  accountExternalIdDebit: string;

  @Field((type) => Int)
  @Column({ default: 1 })
  statusId: number;

  @Field((type) => TransactionStatus)
  @ManyToOne(
    () => TransactionStatus,
    (transactionStatus) => transactionStatus.transactions,
  )
  status: number;

  @Field((type) => Int)
  @Column({ default: 1 })
  typeId: number;

  @Field((type) => TransactionType)
  @ManyToOne(
    () => TransactionType,
    (transactionType) => transactionType.transactions,
  )
  type: number;

  @Field({ nullable: false })
  @Column({ nullable: false })
  accountExternalIdCredit: string;

  @Field({ nullable: false })
  @Column({ nullable: false })
  tranferTypeId: number;

  @Field({ nullable: false })
  @Column({ nullable: false })
  value: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
