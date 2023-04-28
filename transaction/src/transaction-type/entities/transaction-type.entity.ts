import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class TransactionType {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.transactionType)
  @Field(() => [Transaction], { nullable: true })
  transaction: Transaction[];
}
