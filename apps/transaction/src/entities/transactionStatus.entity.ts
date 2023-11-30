import { Directive, ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';
import { IsOptional } from 'class-validator';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity('TRANSACTION_STATUS')
export class TransactionStatus {
  @Field(() => ID)
  @Column({ primary: true })
  id: string;

  @Field(() => String)
  @Column()
  @IsOptional()
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.transactionStatus)
  transactions: Transaction[];
}
