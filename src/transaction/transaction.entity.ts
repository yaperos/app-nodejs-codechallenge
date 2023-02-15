import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TransactionStatus } from 'src/transaction-status/transaction-status.entity';

@ObjectType()
@Entity()
export class Transaction extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @PrimaryColumn('uuid')
  @Field()
  accountExternalIdDebit: string;

  @PrimaryColumn('uuid')
  @Field()
  accountExternalIdCredit: string;

  @Column()
  @Field()
  value: number;

  @Column()
  @Field()
  createdAt: Date;

  @Column()
  @Field(() => Int)
  transactionStatusID: string;

  @Field(() => TransactionStatus)
  @ManyToOne(
    () => TransactionStatus,
    transactionStatus => transactionStatus.transactions,
  )
  transactionStatus: TransactionStatus;

  //@Column()
  //@Field(() => [TransactionStatus], {nullable:true})
  //transactionStatusId: string;

  @Column()
  @Field((type) => Int)
  transacionTypeId: string;
} 
