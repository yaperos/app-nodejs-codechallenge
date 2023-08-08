import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
@ObjectType()
export class TransactionType {
  @PrimaryGeneratedColumn('increment')
  @Field((type) => Int)
  id: number;

  @Field()
  @Column({ nullable: false, unique: true })
  name: 'PENDING' | 'APPROVED' | 'REJECTED';

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.type)
  @Field((type) => [Transaction], { nullable: true })
  transactions?: Transaction[] | null;
}
