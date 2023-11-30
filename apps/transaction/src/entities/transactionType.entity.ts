import { Directive, ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity('TRANSACTION_TYPE')
export class TransactionType {
  @Field(() => ID)
  @Column({ primary: true })
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.transactionType)
  transactions: Transaction[];
}
