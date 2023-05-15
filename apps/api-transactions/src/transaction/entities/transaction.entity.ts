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

  @Column()
  transactionTypeId: number;

  // @Field(() => TransactionType, { nullable: true })
  @ManyToOne(() => TransactionType, (type) => type.id)
  transactionType: TransactionType;

  @Column()
  transactionStatusId: number;

  // @Field(() => TransactionStatus, { nullable: true })
  @ManyToOne(() => TransactionStatus, (status) => status.id)
  transactionStatus: TransactionStatus;

  @Column('numeric')
  @Field(() => Float)
  value: number;

  @Column({ nullable: true })
  observation: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
