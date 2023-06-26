import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm';

@Entity()
@ObjectType()
export class Transaction {

  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Generated('uuid')
  @Field()
  externalId: string;

  @Column()
  @Field()
  accountExternalId: string;

  @Column()
  @Field()
  transactionType: string;

  @Column()
  @Field()
  transferTypeId: number;

  @Column()
  @Field()
  value: number;

  @Column()
  @Field()
  status: string;

  @Column()
  @Field()
  createdAt: Date;

  @Column()
  @Field()
  updatedAt: Date;
}
