import { ObjectType,Field,Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

export enum TransactionStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3
}
// @Field(type => Int)

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryColumn()
  @Field()
  id: string;

  @Column()
  @Field()
  status: number;

  @Column()
  @Field()
  type: number;

  @Column()
  @Field()
  value: number;

  @Column()
  @Field()
  createdAt: Date;
}