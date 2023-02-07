import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  transactionId: string;

  @Column()
  @Field()
  accountExternalIdDebit?: string;

  @Column()
  @Field()
  accountExternalIdCredit?: string;

  @Column()
  @Field()
  tranferTypeId?: number;

  @Column()
  @Field()
  value: number;

  @Column()
  @Field()
  transactionStatus: string;

  @CreateDateColumn()
  @Field({ nullable: true })
  createdAt?: Date;

  @UpdateDateColumn()
  @Field({ nullable: true })
  updatedAt?: Date;
}
