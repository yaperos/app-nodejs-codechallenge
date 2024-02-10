import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transaction_types'})
@ObjectType()
export class TransactionType {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  name: string;

}
