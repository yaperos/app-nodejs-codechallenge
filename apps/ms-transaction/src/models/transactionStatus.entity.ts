import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Transaction } from '../models';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class TransactionStatus {
  @PrimaryGeneratedColumn('increment')
  @Field((type) => Int)
  id: number;

  @Field()
  @Column({ nullable: false, unique: true })
  name: 'pending' | 'approved' | 'rejected';

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.status)
  @Field((type) => [Transaction], { nullable: true })
  transactions?: Transaction[] | null;
}
