import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transaction_statuses'}) 
@ObjectType()
export class TransactionStatus {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  name: string;

}
