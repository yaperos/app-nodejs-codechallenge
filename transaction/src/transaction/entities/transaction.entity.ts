import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('transaction')
@ObjectType()
export class TransactionEntity extends BaseEntity {
  @ObjectIdColumn()
  @Field((type) => ID)
  _id?: ObjectID;

  @PrimaryColumn()
  @Field()
  transactionId?: string;

  @Column()
  @Field()
  accountExternalIdDebit: string;

  @Column()
  @Field()
  accountExternalIdCredit: string;

  @Column()
  @Field()
  transactionType?: string;

  @Column()
  @Field()
  status?: string;

  @Column()
  @Field()
  value: number;

  @Column()
  @Field()
  createdAt?: Date;
}
