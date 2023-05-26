import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

export enum TransactionStatusValues {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3
}

@Entity({name: "transaction_status", schema: "public", synchronize: true})
@ObjectType()
export class TransactionStatus {
  @PrimaryColumn()
  @Field(() => Int, { description: 'id of the status' })
  id: number;

  @Column()
  @Field(() => String, { description: 'name of the status' })
  name: string;

  @OneToMany(() => Transaction, transaction => transaction.transactionType)
  transactions: Transaction[]
}