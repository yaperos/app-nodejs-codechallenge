import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import {ObjectType,Field} from '@nestjs/graphql'

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  accountExternalIdDebit: string;
  

  @Column()
  accountExternalIdCredit: string;

  @Column()
  @Field()
  transferTypeId: number;

  @Column()
  @Field()
  value: number;

  @Column({ default: 'pendiente' })
  @Field()
  transactionStatus: string;

  @CreateDateColumn({
    type:'timestamp',
    name:'created_at'
  })
  @Field()
  createdAt: Date;
}