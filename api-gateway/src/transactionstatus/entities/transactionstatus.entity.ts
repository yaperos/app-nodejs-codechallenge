import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Transactionstatus {
  @Field()
  @PrimaryGeneratedColumn("increment")
  id: number

 
  @Field()
  @Column()
  name: string;


  @Field(()=> [Transaction], {nullable: true})
  @OneToMany(() => Transaction, (transaction) => transaction.transactionStatus )
  transactions: Transaction[]
}
