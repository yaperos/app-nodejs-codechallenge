import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionType } from './transactionType.entity';
import { TransactionStatus } from './transactionStatus.entity';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn()
  // @Field()
  transactionInternalId: number;

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  transactionExternalId: string;

  @Column({ length: 36 })
  @Field()
  accountExternalIdDebit: string;

  @Column({ length: 36 })
  @Field()
  accountExternalIdCredit: string;

  @ManyToOne(() => TransactionType)
  @Field(() => TransactionType, { nullable: true })
  transactionType: number;

  @ManyToOne(() => TransactionStatus)
  @Field(() => TransactionStatus, { nullable: true })
  transactionStatus: number;

  @Column('numeric')
  @Field(() => Float)
  value: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
