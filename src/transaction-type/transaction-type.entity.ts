import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  PrimaryColumn,
  Entity,
  OneToMany,
} from 'typeorm';
import { Transaction } from 'src/transaction/transaction.entity';

@ObjectType()
@Entity()
export class TransactionType extends BaseEntity {
  @Field((type) => String)
  @PrimaryColumn()
  id: string;

  @Column()
  @Field((type) => String)
  name: string;

@Field(() => Transaction,{nullable:true})
@OneToMany(() => Transaction, transaction => transaction.transactionType)
transactions: Transaction[];
}
 