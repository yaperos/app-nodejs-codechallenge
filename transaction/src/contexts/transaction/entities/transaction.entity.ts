import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryColumn
} from 'typeorm';
import { Field, ObjectType } from "@nestjs/graphql";

@Entity({ name: 'transaction' })
@ObjectType()
export class Transaction {

  @PrimaryColumn()
  @Field()
  transaction_id: string;

  @Column()
  @Field()
  account_external_id_debit: string;

  @Column()
  @Field()
  account_external_id_credit: string;

  @Column()
  @Field()
  transaction_type: string;

  @Column()
  @Field()
  transaction_status: string;

  @Column()
  @Field()
  value: number;

  @CreateDateColumn({ type: 'timestamptz' })
  @Field()
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field()
  updated_at: Date;

  constructor(partial: Partial<Transaction>) {
    Object.assign(this, partial);
  }
}

