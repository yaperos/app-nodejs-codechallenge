import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Transaction } from './transaction.entity';


@Entity({name: "transaction_type", schema: "public", synchronize: true})
@ObjectType()
export class TransactionType {
  @PrimaryColumn()
  @Field(() => Int, { description: 'id of the type' })
  id: number;

  @Column()
  @Field(() => String, { description: 'name of the type' })
  name: string;

  @OneToMany(() => Transaction, transaction => transaction.transactionType)
  transactions: Transaction[]
}