import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.transactionStatus)
  @Field(() => [Transaction], { nullable: true })
  transaction: Transaction[];
}
