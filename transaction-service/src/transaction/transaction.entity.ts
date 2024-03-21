import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TransactionStatus } from '../shared/enums/transaction-status.enum';

@ObjectType()
@Entity()
export class Transaction {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  accountExternalIdDebit: string;

  @Field()
  @Column()
  accountExternalIdCredit: string;

  @Field()
  @Column()
  tranferTypeId: number;

  @Field()
  @Column({ type: 'float' })
  value: number;

  @Field(() => TransactionStatus)
  @Column({ default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}