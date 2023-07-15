import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@ObjectType()
@Entity({ name: 'transactions' })
export class Transaction {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  accountExternalIdDebit: string;

  @Field()
  @Column('uuid')
  accountExternalIdCredit: string;

  @Field(() => Int)
  @Column('int')
  transferTypeId: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  value: number;

  @Field()
  @Column('varchar', {
    default: TransactionStatus.PENDING,
  })
  status: string;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  updatedAt?: Date;
}
